import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit2, MapPin, Calendar, Heart, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import profile1 from "@/assets/profiles/profile1.jpg";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "שרה",
    age: 28,
    city: "תל אביב",
    bio: "חובבת אמנות, קפה טוב ושיחות עמוקות. מחפשת מישהו עם חוש הומור ולב טוב 💕",
    interests: ["אמנות", "מוזיקה", "טיולים", "קפה", "סרטים"],
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("הפרופיל עודכן בהצלחה!");
  };

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 gradient-primary relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute bottom-4 left-4 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="absolute -top-16 right-8">
              <div className="relative">
                <img 
                  src={profile1} 
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-elevated"
                />
                <Button 
                  variant="hero" 
                  size="icon" 
                  className="absolute bottom-0 left-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-20">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {profile.name}, {profile.age}
                  </h1>
                  <p className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {profile.city}
                  </p>
                </div>
                <Button 
                  variant={isEditing ? "hero" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? "שמור שינויים" : (
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
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* Interests */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                תחומי עניין
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge 
                    key={interest}
                    className="bg-accent text-accent-foreground px-4 py-2"
                  >
                    {interest}
                  </Badge>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="rounded-full">
                    + הוסף
                  </Button>
                )}
              </div>
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
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">גיל</label>
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.age}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">עיר</label>
                  {isEditing ? (
                    <Input 
                      value={profile.city}
                      onChange={(e) => setProfile({...profile, city: e.target.value})}
                    />
                  ) : (
                    <p className="font-medium text-foreground">{profile.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">הצטרפתי</label>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    ינואר 2024
                  </p>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">לייקים שקיבלתי</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current" /> 156
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">צפיות בפרופיל</span>
                  <span className="font-bold text-foreground">423</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">התאמות</span>
                  <span className="font-bold text-foreground">24</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                פעולות מהירות
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 ml-2" />
                  הגדרות
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
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
