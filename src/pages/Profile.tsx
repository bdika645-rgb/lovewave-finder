import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import FullPageLoader from "@/components/FullPageLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Edit2, MapPin, Calendar, Heart, Settings, LogOut, X, Plus, Loader2, Users, GraduationCap, Ruler, Cigarette, Target, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { israeliCities } from "@/data/members";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; age?: string; height?: string }>({});
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const ageInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, loading, updateProfile, refetch } = useCurrentProfile();
  const { stats, loading: statsLoading } = useProfileStats();
  
  // Local edit state
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    age: 0,
    city: "",
    bio: "",
    interests: [] as string[],
    education: "",
    height: null as number | null,
    smoking: "",
    relationship_goal: "",
  });

  const [initialEditedProfile, setInitialEditedProfile] = useState(editedProfile);

  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return false;
    return JSON.stringify(editedProfile) !== JSON.stringify(initialEditedProfile);
  }, [editedProfile, initialEditedProfile, isEditing]);

  useUnsavedChangesWarning(hasUnsavedChanges);

  const announce = (msg: string) => {
    setLiveMessage(msg);
    window.setTimeout(() => setLiveMessage(""), 1200);
  };

  // Initialize edit state when entering edit mode
  const startEditing = () => {
    if (profile) {
      const next = {
        name: profile.name,
        age: profile.age,
        city: profile.city,
        bio: profile.bio || "",
        interests: profile.interests || [],
        education: profile.education || "",
        height: profile.height,
        smoking: profile.smoking || "",
        relationship_goal: profile.relationship_goal || "",
      };
      setEditedProfile(next);
      setInitialEditedProfile(next);
      setFieldErrors({});
    }
    setIsEditing(true);
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const cancelEditing = () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm("יש שינויים שלא נשמרו. לבטל עריכה?");
      if (!ok) return;
    }
    setEditedProfile(initialEditedProfile);
    setFieldErrors({});
    setShowAddInterest(false);
    setNewInterest("");
    setIsEditing(false);
    announce("בוטלו שינויים");
  };

  const validate = () => {
    const nextErrors: typeof fieldErrors = {};
    const name = editedProfile.name.trim();
    if (!name) nextErrors.name = "נא להזין שם";

    if (!Number.isFinite(editedProfile.age) || editedProfile.age < 18 || editedProfile.age > 120) {
      nextErrors.age = "גיל חייב להיות בין 18 ל-120";
    }

    if (editedProfile.height != null) {
      if (!Number.isFinite(editedProfile.height) || editedProfile.height < 120 || editedProfile.height > 250) {
        nextErrors.height = "גובה חייב להיות בין 120 ל-250 ס\"מ";
      }
    }

    setFieldErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return false;
    }
    if (nextErrors.age) {
      ageInputRef.current?.focus();
      return false;
    }
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      announce("יש שגיאות בטופס");
      toast.error("יש שגיאות בטופס");
      return;
    }
    
    setIsSaving(true);
    
    const { error } = await updateProfile({
      name: editedProfile.name,
      age: editedProfile.age,
      city: editedProfile.city,
      bio: editedProfile.bio,
      interests: editedProfile.interests,
      education: editedProfile.education || null,
      height: editedProfile.height,
      smoking: editedProfile.smoking || null,
      relationship_goal: editedProfile.relationship_goal || null,
    });

    setIsSaving(false);

    if (error) {
      toast.error("שגיאה בשמירת הפרופיל");
      announce("שגיאה בשמירה");
      return;
    }
    
    setIsEditing(false);
    setInitialEditedProfile(editedProfile);
    toast.success("הפרופיל עודכן בהצלחה!");
    announce("הפרופיל נשמר");
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editedProfile.interests.includes(newInterest.trim())) {
      setEditedProfile({
        ...editedProfile, 
        interests: [...editedProfile.interests, newInterest.trim()]
      });
      setNewInterest("");
      setShowAddInterest(false);
      toast.success("תחום עניין נוסף!");
      announce("תחום עניין נוסף");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter(i => i !== interest)
    });
    announce("נמחק");
  };

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm("יש שינויים שלא נשמרו. להתנתק בלי לשמור?");
      if (!ok) return;
    }
    await signOut();
    toast.success("התנתקת בהצלחה!");
    navigate("/");
  };

  const handleSettings = () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm("יש שינויים שלא נשמרו. לעבור להגדרות בלי לשמור?");
      if (!ok) return;
    }
    navigate("/settings");
  };

  useEffect(() => {
    if (!isEditing && profile) {
      const next = {
        name: profile.name,
        age: profile.age,
        city: profile.city,
        bio: profile.bio || "",
        interests: profile.interests || [],
        education: profile.education || "",
        height: profile.height,
        smoking: profile.smoking || "",
        relationship_goal: profile.relationship_goal || "",
      };
      setEditedProfile(next);
      setInitialEditedProfile(next);
    }
  }, [isEditing, profile]);

  const handlePhotoUploadComplete = () => {
    refetch(); // Refresh profile data
  };

  if (loading) {
    return (
      <FullPageLoader 
        label="טוען את הפרופיל שלך..." 
        branded 
        className="min-h-screen bg-muted/20 flex items-center justify-center"
      />
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20" dir="rtl">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">לא נמצא פרופיל</p>
          <Button onClick={() => navigate("/")}>חזרה לדף הבית</Button>
        </div>
      </div>
    );
  }

  const displayProfile = isEditing ? editedProfile : {
    name: profile.name,
    age: profile.age,
    city: profile.city,
    bio: profile.bio || "",
    interests: profile.interests || [],
    education: profile.education || "",
    height: profile.height,
    smoking: profile.smoking || "",
    relationship_goal: profile.relationship_goal || "",
  };

  const imageUrl = profile.avatar_url || "/profiles/profile1.jpg";
  const joinedDate = new Date(profile.created_at).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <Navbar />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 gradient-primary relative">
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar with PhotoUpload */}
            <div className="absolute -top-16 right-8">
              {isEditing ? (
                <PhotoUpload
                  profileId={profile.id}
                  currentAvatarUrl={profile.avatar_url}
                  onUploadComplete={handlePhotoUploadComplete}
                />
              ) : (
                <img 
                  src={imageUrl} 
                  alt={displayProfile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-elevated"
                />
              )}
            </div>

            <div className="pt-20 sm:pt-20">
              {/* Mobile: Stack vertically */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {displayProfile.name}, {displayProfile.age}
                  </h1>
                  <p className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    {displayProfile.city}
                  </p>
                </div>
                
                {/* Action buttons - Full width on mobile */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {hasUnsavedChanges && (
                    <span className="text-sm text-muted-foreground text-center sm:text-right">יש שינויים שלא נשמרו</span>
                  )}

                  {isEditing ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="hero"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="focus-ring gap-2 flex-1 sm:flex-initial h-12 sm:h-auto"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            שומר...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" aria-hidden="true" />
                            שמור
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={isSaving}
                        className="focus-ring flex-1 sm:flex-initial h-12 sm:h-auto"
                      >
                        בטל
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={startEditing} 
                      className="focus-ring gap-2 w-full sm:w-auto h-12 sm:h-auto"
                    >
                      <Edit2 className="w-4 h-4" aria-hidden="true" />
                      ערוך פרופיל
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                קצת עליי
              </h3>
              {isEditing ? (
                <Textarea 
                  id="profile-bio"
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  className="min-h-[120px]"
                  placeholder="ספר/י קצת על עצמך..."
                  aria-label="קצת עליי"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {displayProfile.bio || "עדיין לא נכתב תיאור"}
                </p>
              )}
            </div>

            {/* Interests */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                תחומי עניין
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayProfile.interests.map((interest) => (
                  <div
                    key={interest}
                    className={cn(badgeVariants({ variant: "secondary" }), "px-4 py-2")}
                  >
                    <span>{interest}</span>
                    {isEditing && (
                      <button
                        type="button"
                        className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full focus-ring"
                        onClick={() => handleRemoveInterest(interest)}
                        aria-label={`הסר תחום עניין: ${interest}`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
                {displayProfile.interests.length === 0 && !isEditing && (
                  <p className="text-muted-foreground">עדיין לא נבחרו תחומי עניין</p>
                )}
                {isEditing && !showAddInterest && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => setShowAddInterest(true)}
                  >
                    <Plus className="w-4 h-4" />
                    הוסף
                  </Button>
                )}
              </div>
              {isEditing && showAddInterest && (
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="תחום עניין חדש..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                    className="flex-1"
                    aria-label="הוספת תחום עניין"
                  />
                  <Button variant="hero" size="sm" onClick={handleAddInterest} className="focus-ring">
                    הוסף
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddInterest(false)} className="focus-ring">
                    ביטול
                  </Button>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                פרטים בסיסיים
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-name" className="text-sm text-muted-foreground block mb-1">שם</label>
                  {isEditing ? (
                    <Input 
                      id="profile-name"
                      ref={nameInputRef}
                      value={editedProfile.name}
                      onChange={(e) => {
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                        setEditedProfile({ ...editedProfile, name: e.target.value });
                      }}
                      aria-required="true"
                      aria-invalid={fieldErrors.name ? true : undefined}
                      aria-describedby={fieldErrors.name ? "profile-name-error" : undefined}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{displayProfile.name}</p>
                  )}
                  {isEditing && fieldErrors.name && (
                    <p id="profile-name-error" className="mt-1 text-sm text-destructive">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="profile-age" className="text-sm text-muted-foreground block mb-1">גיל</label>
                  {isEditing ? (
                    <>
                      <Input 
                        id="profile-age"
                        type="number"
                        ref={ageInputRef}
                        value={editedProfile.age}
                        onChange={(e) => {
                          if (fieldErrors.age) setFieldErrors((prev) => ({ ...prev, age: undefined }));
                          setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || 0 });
                        }}
                        aria-required="true"
                        min={18}
                        max={120}
                        aria-invalid={fieldErrors.age ? true : undefined}
                        aria-describedby={fieldErrors.age ? "profile-age-help profile-age-error" : "profile-age-help"}
                      />
                      <p id="profile-age-help" className="mt-1 text-xs text-muted-foreground">
                        גיל חייב להיות בין 18 ל-120
                      </p>
                      {fieldErrors.age && (
                        <p id="profile-age-error" className="mt-1 text-sm text-destructive">{fieldErrors.age}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium text-foreground">{displayProfile.age}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="profile-city" className="text-sm text-muted-foreground block mb-1">עיר</label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.city}
                      onValueChange={(value) => setEditedProfile({...editedProfile, city: value})}
                    >
                      <SelectTrigger id="profile-city">
                        <SelectValue placeholder="בחר עיר" />
                      </SelectTrigger>
                      <SelectContent>
                        {israeliCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium text-foreground">{displayProfile.city}</p>
                  )}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">הצטרפתי</span>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {joinedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Extended Profile Details */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                פרטים נוספים
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground flex items-center gap-1" htmlFor="profile-education">
                    <GraduationCap className="w-4 h-4" aria-hidden="true" /> השכלה
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.education}
                      onValueChange={(value) => setEditedProfile({...editedProfile, education: value})}
                    >
                      <SelectTrigger id="profile-education">
                        <SelectValue placeholder="בחר השכלה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">תיכונית</SelectItem>
                        <SelectItem value="bachelor">תואר ראשון</SelectItem>
                        <SelectItem value="master">תואר שני</SelectItem>
                        <SelectItem value="phd">דוקטורט</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium text-foreground">
                      {displayProfile.education === 'high_school' ? 'תיכונית' :
                       displayProfile.education === 'bachelor' ? 'תואר ראשון' :
                       displayProfile.education === 'master' ? 'תואר שני' :
                       displayProfile.education === 'phd' ? 'דוקטורט' :
                       displayProfile.education === 'other' ? 'אחר' : 'לא צוין'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground flex items-center gap-1" htmlFor="profile-height">
                    <Ruler className="w-4 h-4" aria-hidden="true" /> גובה
                  </label>
                  {isEditing ? (
                    <>
                      <Input 
                        id="profile-height"
                        type="number"
                        value={editedProfile.height || ""}
                        onChange={(e) => {
                          if (fieldErrors.height) setFieldErrors((prev) => ({ ...prev, height: undefined }));
                          setEditedProfile({
                            ...editedProfile,
                            height: e.target.value ? parseInt(e.target.value) : null,
                          });
                        }}
                        placeholder='ס"מ'
                        min={120}
                        max={250}
                        aria-invalid={fieldErrors.height ? true : undefined}
                        aria-describedby={
                          fieldErrors.height ? "profile-height-help profile-height-error" : "profile-height-help"
                        }
                      />
                      <p id="profile-height-help" className="mt-1 text-xs text-muted-foreground">
                        טווח מומלץ: 120–250 ס"מ
                      </p>
                      {fieldErrors.height && (
                        <p id="profile-height-error" className="mt-1 text-sm text-destructive">{fieldErrors.height}</p>
                      )}
                    </>
                  ) : (
                    <p className="font-medium text-foreground">
                      {displayProfile.height ? `${displayProfile.height} ס"מ` : 'לא צוין'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground flex items-center gap-1" htmlFor="profile-smoking">
                    <Cigarette className="w-4 h-4" aria-hidden="true" /> יחס לעישון
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.smoking}
                      onValueChange={(value) => setEditedProfile({...editedProfile, smoking: value})}
                    >
                      <SelectTrigger id="profile-smoking">
                        <SelectValue placeholder="בחר" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">לא מעשן/ת</SelectItem>
                        <SelectItem value="sometimes">לפעמים</SelectItem>
                        <SelectItem value="yes">מעשן/ת</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium text-foreground">
                      {displayProfile.smoking === 'no' ? 'לא מעשן/ת' :
                       displayProfile.smoking === 'sometimes' ? 'לפעמים' :
                       displayProfile.smoking === 'yes' ? 'מעשן/ת' : 'לא צוין'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground flex items-center gap-1" htmlFor="profile-goal">
                    <Target className="w-4 h-4" aria-hidden="true" /> מטרת הקשר
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.relationship_goal}
                      onValueChange={(value) => setEditedProfile({...editedProfile, relationship_goal: value})}
                    >
                      <SelectTrigger id="profile-goal">
                        <SelectValue placeholder="בחר מטרה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serious">קשר רציני</SelectItem>
                        <SelectItem value="casual">הכרויות</SelectItem>
                        <SelectItem value="friendship">חברות</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium text-foreground">
                      {displayProfile.relationship_goal === 'serious' ? 'קשר רציני' :
                       displayProfile.relationship_goal === 'casual' ? 'הכרויות' :
                       displayProfile.relationship_goal === 'friendship' ? 'חברות' : 'לא צוין'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <PhotoGallery
                profileId={profile.id}
                currentAvatarUrl={profile.avatar_url}
                onAvatarChange={handlePhotoUploadComplete}
                editable={isEditing}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                סטטיסטיקות
              </h3>
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">לייקים שקיבלתי</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-current" /> {stats.likesReceived}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">לייקים ששלחתי</span>
                    <span className="font-bold text-secondary flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {stats.likesSent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">התאמות</span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" /> {stats.matchesCount}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                פעולות מהירות
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start focus-ring" onClick={handleSettings}>
                  <Settings className="w-4 h-4 ml-2" aria-hidden="true" />
                  הגדרות
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive focus-ring"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 ml-2" aria-hidden="true" />
                  התנתק
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
