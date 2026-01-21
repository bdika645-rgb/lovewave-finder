import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    
    // Length checks
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Normalize to 0-4 scale
    const normalizedScore = Math.min(4, Math.floor(score / 2));
    
    const labels: Record<number, { label: string; color: string }> = {
      0: { label: "חלשה מאוד", color: "bg-destructive" },
      1: { label: "חלשה", color: "bg-destructive" },
      2: { label: "בינונית", color: "bg-secondary" },
      3: { label: "טובה", color: "bg-success" },
      4: { label: "חזקה מאוד", color: "bg-success" },
    };
    
    return { score: normalizedScore, ...labels[normalizedScore] };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength.score <= 1 ? "text-destructive" : 
        strength.score === 2 ? "text-secondary" : 
        "text-success"
      }`}>
        עוצמת הסיסמה: {strength.label}
      </p>
    </div>
  );
}
