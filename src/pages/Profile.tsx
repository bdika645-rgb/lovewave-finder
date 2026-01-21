import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit2, MapPin, Calendar, Heart, Settings, LogOut, X, Plus, Loader2, Users, GraduationCap, Ruler, Cigarette, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProfileStats } from "@/hooks/useProfileStats";
import PhotoUpload from "@/components/PhotoUpload";
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
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, loading, updateProfile, refetch } = useProfile();
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

  // Initialize edit state when entering edit mode
  const startEditing = () => {
    if (profile) {
      setEditedProfile({
        name: profile.name,
        age: profile.age,
        city: profile.city,
        bio: profile.bio || "",
        interests: profile.interests || [],
        education: profile.education || "",
        height: profile.height,
        smoking: profile.smoking || "",
        relationship_goal: profile.relationship_goal || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedProfile.name.trim()) {
      toast.error("נא להזין שם");
      return;
    }
    if (editedProfile.age < 18 || editedProfile.age > 120) {
      toast.error("גיל לא תקין");
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
      return;
    }
    
    setIsEditing(false);
    toast.success("הפרופיל עודכן בהצלחה!");
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
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter(i => i !== interest)
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("התנתקת בהצלחה!");
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handlePhotoUploadComplete = () => {
    refetch(); // Refresh profile data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
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
      <Navbar />

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

            <div className="pt-20">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {displayProfile.name}, {displayProfile.age}
                  </h1>
                  <p className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {displayProfile.city}
                  </p>
                </div>
                <Button 
                  variant={isEditing ? "hero" : "outline"}
                  onClick={() => isEditing ? handleSave() : startEditing()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      שומר...
                    </>
                  ) : isEditing ? (
                    "שמור שינויים"
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      ערוך פרופיל
                    </>
                  )}
                </Button>
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
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  className="min-h-[120px]"
                  placeholder="ספר/י קצת על עצמך..."
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
                  <Badge 
                    key={interest}
                    className={`bg-accent text-accent-foreground px-4 py-2 ${isEditing ? 'cursor-pointer hover:bg-destructive hover:text-destructive-foreground' : ''}`}
                    onClick={isEditing ? () => handleRemoveInterest(interest) : undefined}
                  >
                    {interest}
                    {isEditing && <X className="w-3 h-3 mr-1" />}
                  </Badge>
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
                  />
                  <Button variant="hero" size="sm" onClick={handleAddInterest}>
                    הוסף
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddInterest(false)}>
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
                  <label className="text-sm text-muted-foreground">שם</label>
                  {isEditing ? (
                    <Input 
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{displayProfile.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">גיל</label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value) || 0})}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{displayProfile.age}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">עיר</label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.city}
                      onValueChange={(value) => setEditedProfile({...editedProfile, city: value})}
                    >
                      <SelectTrigger>
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
                  <label className="text-sm text-muted-foreground">הצטרפתי</label>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
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
                  <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" /> השכלה
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.education}
                      onValueChange={(value) => setEditedProfile({...editedProfile, education: value})}
                    >
                      <SelectTrigger>
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
                  <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Ruler className="w-4 h-4" /> גובה
                  </label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={editedProfile.height || ""}
                      onChange={(e) => setEditedProfile({...editedProfile, height: e.target.value ? parseInt(e.target.value) : null})}
                      placeholder='ס"מ'
                      min={120}
                      max={250}
                    />
                  ) : (
                    <p className="font-medium text-foreground">
                      {displayProfile.height ? `${displayProfile.height} ס"מ` : 'לא צוין'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Cigarette className="w-4 h-4" /> יחס לעישון
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.smoking}
                      onValueChange={(value) => setEditedProfile({...editedProfile, smoking: value})}
                    >
                      <SelectTrigger>
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
                  <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Target className="w-4 h-4" /> מטרת הקשר
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.relationship_goal}
                      onValueChange={(value) => setEditedProfile({...editedProfile, relationship_goal: value})}
                    >
                      <SelectTrigger>
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
                <Button variant="ghost" className="w-full justify-start" onClick={handleSettings}>
                  <Settings className="w-4 h-4 ml-2" />
                  הגדרות
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 ml-2" />
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
