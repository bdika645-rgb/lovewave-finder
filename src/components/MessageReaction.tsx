import { memo, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

const EMOJI_OPTIONS = ["❤️", "😂", "😮", "😢", "🔥", "👍"];

interface MessageReactionProps {
  messageId: string;
  myProfileId: string | null;
  isMine: boolean;
}

interface Reaction {
  id: string;
  emoji: string;
  profile_id: string;
}

const MessageReaction = memo(({ messageId, myProfileId, isMine }: MessageReactionProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing reactions
  useEffect(() => {
    const fetchReactions = async () => {
      const { data } = await supabase
        .from("message_reactions")
        .select("id, emoji, profile_id")
        .eq("message_id", messageId);
      if (data) setReactions(data);
    };
    fetchReactions();
  }, [messageId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`reactions-${messageId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${messageId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setReactions((prev) => [...prev, payload.new as Reaction]);
          } else if (payload.eventType === "DELETE") {
            setReactions((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId]);

  const myReaction = reactions.find((r) => r.profile_id === myProfileId);

  const handleReact = useCallback(
    async (emoji: string) => {
      if (!myProfileId || loading) return;
      setLoading(true);
      setShowPicker(false);

      try {
        // If same emoji, remove it
        if (myReaction?.emoji === emoji) {
          await supabase
            .from("message_reactions")
            .delete()
            .eq("id", myReaction.id);
          setReactions((prev) => prev.filter((r) => r.id !== myReaction.id));
        } else {
          // Remove existing reaction if any
          if (myReaction) {
            await supabase
              .from("message_reactions")
              .delete()
              .eq("id", myReaction.id);
            setReactions((prev) => prev.filter((r) => r.id !== myReaction.id));
          }
          // Add new reaction
          const { data, error } = await supabase
            .from("message_reactions")
            .insert({ message_id: messageId, profile_id: myProfileId, emoji })
            .select()
            .single();
          if (!error && data) {
            setReactions((prev) => [...prev, data]);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [myProfileId, myReaction, messageId, loading]
  );

  // Group reactions by emoji
  const grouped = reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={cn("relative flex items-center gap-1 mt-0.5", isMine ? "justify-end" : "justify-start")}>
      {/* Display existing reactions */}
      {Object.entries(grouped).map(([emoji, count]) => (
        <motion.button
          key={emoji}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-full border transition-colors",
            myReaction?.emoji === emoji
              ? "bg-primary/20 border-primary/40"
              : "bg-muted/50 border-border hover:bg-muted"
          )}
          onClick={() => handleReact(emoji)}
          aria-label={`${emoji} (${count})`}
        >
          {emoji} {count > 1 && <span className="text-[10px]">{count}</span>}
        </motion.button>
      ))}

      {/* Add reaction button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-muted"
        aria-label="הוסף תגובה"
      >
        <Smile className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {/* Emoji picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            className={cn(
              "absolute z-20 bg-card border border-border rounded-full shadow-lg px-2 py-1 flex gap-1",
              isMine ? "left-0 bottom-full mb-1" : "right-0 bottom-full mb-1"
            )}
          >
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="text-lg hover:scale-125 transition-transform p-0.5"
                aria-label={`תגובה: ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MessageReaction.displayName = "MessageReaction";

export default MessageReaction;
