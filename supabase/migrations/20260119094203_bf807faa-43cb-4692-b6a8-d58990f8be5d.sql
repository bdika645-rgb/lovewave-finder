-- Add admin delete policy for matches
CREATE POLICY "Admins can delete matches" 
ON public.matches 
FOR DELETE 
USING (is_admin());

-- Add admin delete policy for messages
CREATE POLICY "Admins can delete messages" 
ON public.messages 
FOR DELETE 
USING (is_admin());

-- Add admin delete policy for photos  
CREATE POLICY "Admins can delete photos"
ON public.photos
FOR DELETE
USING (is_admin());