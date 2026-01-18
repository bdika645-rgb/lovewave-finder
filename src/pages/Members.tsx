import { useState } from "react";
import Navbar from "@/components/Navbar";
import MemberCard from "@/components/MemberCard";
import { members } from "@/data/members";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleLike = (memberName: string) => {
    toast.success(`שלחת לייק ל${memberName}! 💕`);
  };

  const handlePass = (memberName: string) => {
    toast(`דילגת על ${memberName}`);
  };

  const filteredMembers = members.filter(member =>
    member.name.includes(searchQuery) || 
    member.city.includes(searchQuery) ||
    member.interests.some(i => i.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            גלו את <span className="text-gradient">ההתאמה</span> שלכם
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            דפדפו בפרופילים ומצאו אנשים שמתאימים לכם
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="חפשו לפי שם, עיר או תחומי עניין..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 rounded-xl bg-card border-border text-lg"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-14 w-14 rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-card rounded-2xl shadow-card animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">גיל</label>
                  <div className="flex gap-2">
                    <Input placeholder="מ-" className="h-10" />
                    <Input placeholder="עד" className="h-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">מיקום</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="עיר או אזור" className="pr-10 h-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">מרחק</label>
                  <Input placeholder="עד כמה ק״מ" className="h-10" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="hero" size="sm">החל פילטרים</Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            נמצאו <span className="font-semibold text-foreground">{filteredMembers.length}</span> פרופילים
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member}
              onLike={() => handleLike(member.name)}
              onPass={() => handlePass(member.name)}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">לא נמצאו תוצאות. נסו לשנות את החיפוש.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
