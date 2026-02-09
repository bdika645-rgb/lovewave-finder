import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import { useProfilePrompts, type ProfilePrompt } from "@/hooks/useProfilePrompts";

interface ProfilePromptsDisplayProps {
  profileId: string;
}

const ProfilePromptsDisplay = ({ profileId }: ProfilePromptsDisplayProps) => {
  const { prompts, loading } = useProfilePrompts(profileId);

  if (loading || prompts.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <MessageSquareQuote className="w-5 h-5 text-primary" />
        קצת יותר עליי
      </h3>
      <div className="space-y-3">
        {prompts.map((prompt, i) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10"
          >
            <p className="text-sm font-medium text-primary mb-1.5">{prompt.prompt_question}</p>
            <p className="text-foreground leading-relaxed">{prompt.prompt_answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePromptsDisplay;
