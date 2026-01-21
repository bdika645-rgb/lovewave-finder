import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useIcebreakers } from '@/hooks/useIcebreakers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IcebreakerButtonProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function IcebreakerButton({ onSelect, disabled }: IcebreakerButtonProps) {
  const { getRandomIcebreaker, loading } = useIcebreakers();

  const handleClick = () => {
    const icebreaker = getRandomIcebreaker();
    if (icebreaker) {
      onSelect(icebreaker.question);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          disabled={disabled || loading}
          className="shrink-0"
          aria-label="שאלה שוברת קרח"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-secondary" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>שאלה שוברת קרח ✨</p>
      </TooltipContent>
    </Tooltip>
  );
}
