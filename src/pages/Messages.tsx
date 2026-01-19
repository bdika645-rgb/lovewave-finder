import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Phone, Video, MoreVertical, Smile, Image, Paperclip, Loader2, MessageCircle, Heart, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useMatches } from "@/hooks/useMatches";
import { Link } from "react-router-dom";

const Messages = () => {
  const { conversations, loading: conversationsLoading, createOrGetConversation, getMyProfileId, refetch: refetchConversations } = useConversations();
  const { matches, loading: matchesLoading } = useMatches();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading: messagesLoading, sendMessage, markAsRead } = useMessages(selectedConversationId);

  // Get selected conversation details
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && messages.length > 0) {
      markAsRead();
      // Refetch conversations to update unread counts
      const timer = setTimeout(() => refetchConversations(), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedConversationId, messages.length, markAsRead, refetchConversations]);

  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    getMyProfileId().then(setMyProfileId);
  }, [getMyProfileId]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversationId || sendingMessage) return;
    
    setSendingMessage(true);
    const { error } = await sendMessage(messageText);
    setSendingMessage(false);

    if (error) {
      toast.error("שגיאה בשליחת ההודעה");
      return;
    }

    setMessageText("");
    refetchConversations();
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
  };

  const startConversationFromMatch = async (profileId: string) => {
    const conversationId = await createOrGetConversation(profileId);
    if (conversationId) {
      setSelectedConversationId(conversationId);
      refetchConversations();
    } else {
      toast.error("שגיאה ביצירת השיחה");
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherProfile?.name?.includes(searchQuery) || 
    conv.lastMessage?.content?.includes(searchQuery)
  );

  // Filter matches that don't have a conversation yet
  const matchesWithoutConversation = matches.filter(match => 
    !conversations.some(conv => conv.otherProfile?.id === match.matchedProfile?.id)
  );

  const handleCall = () => {
    toast.info("שיחות קוליות יהיו זמינות בגרסה הבאה");
  };

  const handleVideoCall = () => {
    toast.info("שיחות וידאו יהיו זמינות בגרסה הבאה");
  };

  const handleAttachment = () => {
    toast.info("שליחת קבצים תהיה זמינה בגרסה הבאה");
  };

  const handleImage = () => {
    toast.info("שליחת תמונות תהיה זמינה בגרסה הבאה");
  };

  const handleEmoji = () => {
    toast.info("בחירת אימוג'ים תהיה זמינה בגרסה הבאה");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "עכשיו";
    if (hours < 24) return `לפני ${hours} שעות`;
    if (days === 1) return "אתמול";
    return date.toLocaleDateString('he-IL');
  };

  if (conversationsLoading || matchesLoading) {
    return (
      <div className="min-h-screen bg-muted/20" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-6 pt-24 pb-6 flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const hasNoConversationsOrMatches = conversations.length === 0 && matches.length === 0;

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-6">
        <div className="bg-card rounded-3xl shadow-card overflow-hidden h-[calc(100vh-120px)]">
          {hasNoConversationsOrMatches ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">עדיין אין התאמות</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                התחילו לעשות לייקים לפרופילים ותקבלו התאמות! כשתהיה לכם התאמה, תוכלו להתחיל לשוחח.
              </p>
              <Link to="/members">
                <Button variant="hero" size="lg">
                  <Search className="w-5 h-5" />
                  גלו פרופילים
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] h-full">
              {/* Conversations List */}
              <div className={`border-l border-border ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 border-b border-border">
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-4">הודעות</h2>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="חפש בהודעות..." 
                      className="pr-10 bg-muted/50 border-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* New Matches Section */}
                {matchesWithoutConversation.length > 0 && (
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">התאמות חדשות</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {matchesWithoutConversation.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => startConversationFromMatch(match.matchedProfile.id)}
                          className="flex-shrink-0 text-center group"
                        >
                          <div className="relative">
                            <img 
                              src={match.matchedProfile.avatar_url || "/profiles/profile1.jpg"} 
                              alt={match.matchedProfile.name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-primary group-hover:border-primary/80 transition-colors"
                            />
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Heart className="w-3 h-3 text-primary-foreground fill-current" />
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-foreground truncate max-w-[60px]">
                            {match.matchedProfile.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="overflow-y-auto h-[calc(100%-100px)]">
                  {filteredConversations.length === 0 && conversations.length === 0 && matches.length > 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>לחצו על התאמה כדי להתחיל שיחה!</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      לא נמצאו שיחות
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                          selectedConversationId === conv.id ? "bg-accent" : ""
                        }`}
                      >
                        <div className="relative">
                          <img 
                            src={conv.otherProfile?.avatar_url || "/profiles/profile1.jpg"} 
                            alt={conv.otherProfile?.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {conv.otherProfile?.is_online && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-foreground">{conv.otherProfile?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {conv.lastMessage ? formatTime(conv.lastMessage.created_at) : formatTime(conv.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conv.lastMessage?.content || "התחילו לשוחח!"}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              {selectedConversation ? (
                <div className={`flex flex-col h-full ${selectedConversationId ? 'block' : 'hidden md:block'}`}>
                  {/* Chat Header */}
                  <div className="p-3 md:p-4 border-b border-border flex items-center justify-between gap-2">
                    {/* Back button for mobile */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden shrink-0"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Link to={`/member/${selectedConversation.otherProfile?.id}`} className="shrink-0">
                        <img 
                          src={selectedConversation.otherProfile?.avatar_url || "/profiles/profile1.jpg"}
                          alt={selectedConversation.otherProfile?.name}
                          className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div>
                        <Link 
                          to={`/member/${selectedConversation.otherProfile?.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {selectedConversation.otherProfile?.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.otherProfile?.is_online ? "מחובר/ת" : "לא מחובר/ת"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                      <Button variant="ghost" size="icon" onClick={handleCall} className="hidden sm:inline-flex">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleVideoCall} className="hidden sm:inline-flex">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">שלחו הודעה ראשונה!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isMine = message.sender_id === myProfileId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                                isMine
                                  ? "gradient-primary text-primary-foreground rounded-br-sm"
                                  : "bg-muted text-foreground rounded-bl-sm"
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}>
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-2 md:p-4 border-t border-border">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Button variant="ghost" size="icon" onClick={handleAttachment} className="hidden sm:inline-flex">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleImage} className="hidden sm:inline-flex">
                        <Image className="w-5 h-5" />
                      </Button>
                      <Input
                        placeholder="כתבו הודעה..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 h-10 md:h-12 rounded-full bg-muted/50 border-none text-sm md:text-base"
                      />
                      <Button variant="ghost" size="icon" onClick={handleEmoji} className="hidden sm:inline-flex">
                        <Smile className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="hero" 
                        size="icon"
                        onClick={handleSend}
                        disabled={!messageText.trim() || sendingMessage}
                      >
                        {sendingMessage ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">בחרו שיחה להתחיל</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
