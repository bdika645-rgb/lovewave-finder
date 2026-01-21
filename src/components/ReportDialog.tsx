import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useReportProfile, reportReasons, ReportReason } from "@/hooks/useReportProfile";
import { toast } from "sonner";
import { Loader2, Flag } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  profileName: string;
}

const ReportDialog = ({ open, onOpenChange, profileId, profileName }: ReportDialogProps) => {
  const { reportProfile, loading } = useReportProfile();
  const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("נא לבחור סיבה לדיווח");
      return;
    }

    const { error } = await reportProfile(profileId, selectedReason, description);

    if (error) {
      toast.error("שגיאה בשליחת הדיווח");
      return;
    }

    toast.success("הדיווח נשלח בהצלחה. תודה על שמירה על הקהילה!");
    setSelectedReason("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-destructive" />
            דיווח על {profileName}
          </DialogTitle>
          <DialogDescription>
            בחר/י סיבה לדיווח על הפרופיל הזה. הצוות שלנו יבדוק את הדיווח בהקדם.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>סיבת הדיווח</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={(value) => setSelectedReason(value as ReportReason)}
              className="space-y-2"
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">פרטים נוספים (אופציונלי)</Label>
            <Textarea
              id="description"
              placeholder="תאר/י את הבעיה..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ביטול
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSubmit}
            disabled={loading || !selectedReason}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                שולח...
              </>
            ) : (
              "שלח דיווח"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
