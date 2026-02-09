import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, MessageSquareQuote, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProfilePrompts, PROMPT_QUESTIONS, type ProfilePrompt } from "@/hooks/useProfilePrompts";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfilePromptsEditorProps {
  /** Max number of prompts a user can have */
  max?: number;
}

const ProfilePromptsEditor = ({ max = 3 }: ProfilePromptsEditorProps) => {
  const { prompts, loading, addPrompt, updatePrompt, deletePrompt } = useProfilePrompts();
  const [adding, setAdding] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] = useState("");

  const usedQuestions = prompts.map(p => p.prompt_question);
  const availableQuestions = PROMPT_QUESTIONS.filter(q => !usedQuestions.includes(q));

  const handleAdd = async () => {
    if (!selectedQuestion || !answer.trim()) {
      toast.error("יש לבחור שאלה ולכתוב תשובה");
      return;
    }
    setSaving(true);
    const { error } = await addPrompt(selectedQuestion, answer.trim());
    setSaving(false);
    if (error) {
      toast.error("שגיאה בשמירה");
    } else {
      toast.success("הפרומפט נוסף!");
      setAdding(false);
      setSelectedQuestion("");
      setAnswer("");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editAnswer.trim()) return;
    setSaving(true);
    const { error } = await updatePrompt(id, editAnswer.trim());
    setSaving(false);
    if (error) {
      toast.error("שגיאה בעדכון");
    } else {
      setEditingId(null);
      toast.success("עודכן!");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deletePrompt(id);
    if (error) {
      toast.error("שגיאה במחיקה");
    } else {
      toast.success("הפרומפט הוסר");
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">הפרומפטים שלי</h3>
        </div>
        <span className="text-xs text-muted-foreground">{prompts.length}/{max}</span>
      </div>

      <AnimatePresence mode="popLayout">
        {prompts.map((prompt) => (
          <motion.div
            key={prompt.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-muted/50 rounded-xl p-4 border border-border"
          >
            <p className="text-sm font-medium text-primary mb-2">{prompt.prompt_question}</p>
            {editingId === prompt.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editAnswer}
                  onChange={e => setEditAnswer(e.target.value)}
                  maxLength={200}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(prompt.id)} disabled={saving}>
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    שמור
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>ביטול</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground leading-relaxed">{prompt.prompt_answer}</p>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => { setEditingId(prompt.id); setEditAnswer(prompt.prompt_answer); }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive"
                    onClick={() => handleDelete(prompt.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {adding ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border-2 border-primary/20 space-y-3"
        >
          <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
            <SelectTrigger>
              <SelectValue placeholder="בחר/י שאלה..." />
            </SelectTrigger>
            <SelectContent>
              {availableQuestions.map(q => (
                <SelectItem key={q} value={q}>{q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="כתוב/י את התשובה שלך..."
            maxLength={200}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={saving || !selectedQuestion || !answer.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              הוסף
            </Button>
            <Button variant="ghost" onClick={() => { setAdding(false); setSelectedQuestion(""); setAnswer(""); }}>
              ביטול
            </Button>
          </div>
        </motion.div>
      ) : prompts.length < max && availableQuestions.length > 0 ? (
        <Button
          variant="outline"
          className="w-full border-dashed gap-2"
          onClick={() => setAdding(true)}
        >
          <Plus className="w-4 h-4" />
          הוסף פרומפט
        </Button>
      ) : null}
    </div>
  );
};

export default ProfilePromptsEditor;
