import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface ProfileData {
  name?: string;
  age?: number;
  city?: string;
  bio?: string;
  interests?: string[];
  avatar_url?: string;
  education?: string;
  height?: number;
  smoking?: string;
  relationship_goal?: string;
}

interface ProfileCompletenessMeterProps {
  profile: ProfileData;
  className?: string;
}

interface CompletionItem {
  key: string;
  label: string;
  isComplete: boolean;
}

export default function ProfileCompletenessMeter({ 
  profile, 
  className 
}: ProfileCompletenessMeterProps) {
  const completionItems: CompletionItem[] = [
    { key: 'name', label: 'שם', isComplete: !!profile.name },
    { key: 'age', label: 'גיל', isComplete: !!profile.age },
    { key: 'city', label: 'עיר', isComplete: !!profile.city },
    { key: 'avatar', label: 'תמונה', isComplete: !!profile.avatar_url },
    { key: 'bio', label: 'תיאור אישי', isComplete: !!profile.bio && profile.bio.length > 20 },
    { key: 'interests', label: 'תחומי עניין', isComplete: !!profile.interests && profile.interests.length >= 3 },
    { key: 'education', label: 'השכלה', isComplete: !!profile.education },
    { key: 'height', label: 'גובה', isComplete: !!profile.height },
    { key: 'relationship_goal', label: 'מטרת הקשר', isComplete: !!profile.relationship_goal },
  ];

  const completedCount = completionItems.filter(item => item.isComplete).length;
  const percentage = Math.round((completedCount / completionItems.length) * 100);

  const getStatusColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className={cn("bg-card rounded-2xl p-6 shadow-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-foreground">
          שלמות הפרופיל
        </h3>
        <span className={cn("font-bold text-xl", getStatusColor())}>
          {percentage}%
        </span>
      </div>

      <div className="mb-6">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {percentage < 100 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            פרופיל מלא יותר מקבל יותר התאמות! 💕
          </p>
          
          <div className="space-y-2">
            {completionItems.map(item => (
              <div 
                key={item.key}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  item.isComplete ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {item.isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={item.isComplete ? "line-through" : ""}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {percentage === 100 && (
        <div className="text-center">
          <p className="text-success font-medium">
            🎉 הפרופיל שלך מושלם!
          </p>
        </div>
      )}
    </div>
  );
}
