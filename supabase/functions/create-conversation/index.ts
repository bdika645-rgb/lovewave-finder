import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type CreateConversationBody = {
  otherProfileId?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey =
      Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error('Missing required environment variables')
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    })

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })

    const { data: authData, error: authError } = await userClient.auth.getUser()
    if (authError || !authData?.user) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json().catch(() => ({}))) as CreateConversationBody
    const otherProfileId = body.otherProfileId
    if (!otherProfileId) {
      return new Response(JSON.stringify({ error: 'otherProfileId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Resolve caller profile id
    const { data: myProfile, error: myProfileErr } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', authData.user.id)
      .maybeSingle()

    if (myProfileErr) {
      console.error('Failed fetching caller profile:', myProfileErr)
      return new Response(JSON.stringify({ error: 'Failed to resolve profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!myProfile?.id) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const myProfileId = myProfile.id
    if (myProfileId === otherProfileId) {
      return new Response(JSON.stringify({ error: 'Cannot message yourself' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Ensure there's a match between the two profiles
    const [p1, p2] = myProfileId < otherProfileId
      ? [myProfileId, otherProfileId]
      : [otherProfileId, myProfileId]

    const { data: matchRow, error: matchErr } = await adminClient
      .from('matches')
      .select('id')
      .eq('profile1_id', p1)
      .eq('profile2_id', p2)
      .maybeSingle()

    if (matchErr) {
      console.error('Failed checking match:', matchErr)
      return new Response(JSON.stringify({ error: 'Failed to validate match' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!matchRow) {
      return new Response(JSON.stringify({ error: 'Not matched' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If a conversation already exists between these profiles, return it.
    const { data: myParticipations, error: myPartErr } = await adminClient
      .from('conversation_participants')
      .select('conversation_id')
      .eq('profile_id', myProfileId)

    if (myPartErr) {
      console.error('Failed fetching participations:', myPartErr)
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const myConversationIds = (myParticipations ?? []).map((p) => p.conversation_id)
    if (myConversationIds.length > 0) {
      const { data: shared, error: sharedErr } = await adminClient
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', otherProfileId)
        .in('conversation_id', myConversationIds)
        .limit(1)

      if (sharedErr) {
        console.error('Failed checking existing conversation:', sharedErr)
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (shared && shared.length > 0) {
        return new Response(
          JSON.stringify({ conversationId: shared[0].conversation_id, existing: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create conversation + participants (server-side, service role)
    const { data: newConversation, error: convErr } = await adminClient
      .from('conversations')
      .insert({})
      .select('id')
      .single()

    if (convErr || !newConversation?.id) {
      console.error('Failed creating conversation:', convErr)
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: participantsErr } = await adminClient
      .from('conversation_participants')
      .insert([
        { conversation_id: newConversation.id, profile_id: myProfileId },
        { conversation_id: newConversation.id, profile_id: otherProfileId },
      ])

    if (participantsErr) {
      console.error('Failed inserting participants:', participantsErr)
      // Best effort cleanup
      await adminClient.from('conversations').delete().eq('id', newConversation.id)
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ conversationId: newConversation.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Unhandled error in create-conversation:', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
