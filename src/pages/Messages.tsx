import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import SkipToContent from "@/components/SkipToContent";
import TypingIndicator from "@/components/TypingIndicator";
import IcebreakerButton from "@/components/IcebreakerButton";
import ReadReceipt from "@/components/ReadReceipt";
import ConversationMenu from "@/components/ConversationMenu";
import MessageReaction from "@/components/MessageReaction";
import FullPageLoader from "@/components/FullPageLoader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Loader2, MessageCircle, Heart, ChevronRight, SearchX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useMatches } from "@/hooks/useMatches";
import { useTypingStatus } from "@/hooks/useTypingStatus";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

const Messages = () => {
  const { conversations, loading: conversationsLoading, createOrGetConversation, getMyProfileId, refetch: refetchConversations } = useConversations();
  const { matches, loading: matchesLoading } = useMatches();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  const { messages, loading: messagesLoading, sendMessage, markAsRead } = useMessages(selectedConversationId);
  const { othersTyping, setTyping } = useTypingStatus(selectedConversationId, myProfileId);

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

  useEffect(() => {
    getMyProfileId().then(setMyProfileId);
  }, [getMyProfileId]);

  // Handle typing indicator
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (e.target.value.length > 0) {
      setTyping(true);
    }
  }, [setTyping]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversationId || sendingMessage) return;
    
    setTyping(false);
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

  const handleIcebreakerSelect = (question: string) => {
    setMessageText(question);
    setTyping(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherProfile?.name?.includes(searchQuery) || 
    conv.lastMessage?.content?.includes(searchQuery)
  );

  const hasActiveSearch = searchQuery.trim().length > 0;

  // Filter matches that don't have a conversation yet
  const matchesWithoutConversation = matches.filter(match => 
    !conversations.some(conv => conv.otherProfile?.id === match.matchedProfile?.id)
  );

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
      <>
        <SkipToContent />
        <Navbar />
        <FullPageLoader label="טוען שיחות..." branded className="min-h-screen bg-muted/20 flex items-center justify-center" />
      </>
    );
  }

  const hasNoConversationsOrMatches = conversations.length === 0 && matches.length === 0;

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <SEOHead title="הודעות" description="שוחחו עם ההתאמות שלכם ומצאו את האהבה." />
      <Navbar />

      <main id="main-content" className="container mx-auto px-6 pt-24 pb-24 md:pb-6">
        <h1 className="sr-only">הודעות</h1>
        <div className="bg-card rounded-3xl shadow-card overflow-hidden h-[calc(100vh-120px)]">
          {hasNoConversationsOrMatches ? (
            <div className="flex items-center justify-center h-full p-8">
              <EmptyState
                icon={<Heart className="w-10 h-10" />}
                title="עדיין אין שיחות"
                description="כשתקבלו התאמה הדדית עם מישהו, תוכלו להתחיל לשוחח כאן."
                actionLabel="גלו פרופילים"
                actionLink="/discover"
                secondaryActionLabel="שפרו את הפרופיל"
                secondaryActionLink="/profile"
                variant="action"
                tips={[
                  "שלחו לייקים בעמוד הגילוי",
                  "כשיש לייק הדדי — נוצרת התאמה",
                  "התחילו שיחה מההתאמות שלכם",
                ]}
              />
            </div>
          ) : (
            <div className="flex flex-col md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] h-full">
              {/* Conversations List */}
              <div className={`border-l border-border ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 border-b border-border">
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-4">שיחות</h2>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <Input 
                      placeholder="חפש בהודעות..." 
                      className="pr-10 bg-muted/50 border-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="חיפוש בהודעות"
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
                          className="flex-shrink-0 text-center group focus-ring rounded-xl"
                          aria-label={`התחל שיחה עם ${match.matchedProfile.name}`}
                        >
                          <div className="relative">
                            <img 
                              src={match.matchedProfile.avatar_url || "/profiles/profile1.jpg"} 
                              alt={`תמונת פרופיל של ${match.matchedProfile.name}`}
                              className="w-14 h-14 rounded-full object-cover border-2 border-primary group-hover:border-primary/80 transition-colors"
                            />
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Heart className="w-3 h-3 text-primary-foreground fill-current" aria-hidden="true" />
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
                
                <div className="overflow-y-auto h-[calc(100%-100px)] scroll-smooth-ios" style={{ WebkitOverflowScrolling: 'touch' }} role="list" aria-label="רשימת שיחות">
                  {filteredConversations.length === 0 && conversations.length === 0 && matches.length > 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                      <p>לחצו על התאמה כדי להתחיל שיחה!</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground" role="status" aria-live="polite">
                      <p className="mb-3">לא נמצאו שיחות</p>
                      {hasActiveSearch && (
                        <p className="text-sm mb-4">
                          נסו שם פרטי או מילת מפתח מההודעה האחרונה.
                        </p>
                      )}
                      {hasActiveSearch && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="mx-auto"
                          aria-label="נקה חיפוש"
                        >
                          נקה חיפוש
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredConversations.map((conv, index) => (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`w-full p-4 flex items-center gap-3 transition-all duration-200 ${
                          selectedConversationId === conv.id 
                            ? "bg-accent shadow-sm" 
                            : "hover:bg-muted/50 hover:translate-x-1"
                        } focus-ring`}
                        role="listitem"
                        aria-selected={selectedConversationId === conv.id}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="relative">
                          <img 
                            src={conv.otherProfile?.avatar_url || "/profiles/profile1.jpg"} 
                            alt={`תמונת פרופיל של ${conv.otherProfile?.name || "משתמש"}`}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20"
                          />
                          {conv.otherProfile?.is_online && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse" aria-label="מחובר/ת" />
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-semibold transition-colors ${
                              conv.unreadCount > 0 ? "text-foreground" : "text-foreground/80"
                            }`}>{conv.otherProfile?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {conv.lastMessage ? formatTime(conv.lastMessage.created_at) : formatTime(conv.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate max-w-[180px] ${
                              conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                            }`}>
                              {conv.lastMessage?.content || "התחילו לשוחח!"}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center animate-scale-in" aria-label={`${conv.unreadCount} הודעות שלא נקראו`}>
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
                      aria-label="חזרה לרשימת השיחות"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Link to={`/member/${selectedConversation.otherProfile?.id}`} className="shrink-0 rounded-full focus-ring">
                        <img 
                          src={selectedConversation.otherProfile?.avatar_url || "/profiles/profile1.jpg"}
                          alt={`תמונת פרופיל של ${selectedConversation.otherProfile?.name || "משתמש"}`}
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
                        <div className="text-sm text-muted-foreground">
                          {othersTyping.length > 0 ? (
                            <TypingIndicator />
                          ) : selectedConversation.otherProfile?.is_online ? (
                            <span className="text-success font-medium">מחובר/ת עכשיו</span>
                          ) : selectedConversation.otherProfile?.last_seen ? (
                            <span>נצפה {formatDistanceToNow(new Date(selectedConversation.otherProfile.last_seen), { addSuffix: true, locale: he })}</span>
                          ) : (
                            "לא מחובר/ת"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowChatSearch(!showChatSearch);
                          if (showChatSearch) setChatSearchQuery("");
                        }}
                        aria-label="חיפוש בשיחה"
                        className="rounded-full"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                      <ConversationMenu
                        conversationId={selectedConversationId!}
                        otherProfileId={selectedConversation.otherProfile?.id || ''}
                        otherProfileName={selectedConversation.otherProfile?.name || ''}
                        onConversationDeleted={() => {
                          setSelectedConversationId(null);
                          refetchConversations();
                        }}
                        onUserBlocked={() => {
                          setSelectedConversationId(null);
                          refetchConversations();
                        }}
                      />
                    </div>
                  </div>

                  {/* In-chat search bar */}
                  {showChatSearch && (
                    <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      <Input
                        placeholder="חיפוש בשיחה..."
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        className="h-8 bg-transparent border-none text-sm"
                        aria-label="חיפוש בתוך השיחה"
                        autoFocus
                      />
                      {chatSearchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setChatSearchQuery("")}
                          className="h-6 px-2 text-xs"
                        >
                          נקה
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Messages */}
                  <div 
                    className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth" 
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    role="log" 
                    aria-label="הודעות"
                    aria-live="off"
                    aria-relevant="additions"
                    aria-busy={messagesLoading}
                  >
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full" role="status">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
                        <span className="sr-only">טוען הודעות...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center" role="status" aria-live="polite">
                        <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-3" aria-hidden="true" />
                        <p className="text-muted-foreground mb-2">שלחו הודעה ראשונה!</p>
                        <p className="text-sm text-muted-foreground">
                          טיפ: נסו משפט פתיחה קצר או השתמשו בכפתור השאלה (Icebreaker).
                        </p>
                      </div>
                    ) : (() => {
                      const filteredMessages = chatSearchQuery.trim()
                        ? messages.filter(m => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                        : messages;
                      
                      if (filteredMessages.length === 0 && chatSearchQuery.trim()) {
                        return (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <SearchX className="w-10 h-10 text-muted-foreground/50 mb-2" aria-hidden="true" />
                            <p className="text-muted-foreground text-sm">לא נמצאו הודעות עבור "{chatSearchQuery}"</p>
                          </div>
                        );
                      }

                      return filteredMessages.map((message) => {
                        const isMine = message.sender_id === myProfileId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={`px-4 py-3 rounded-2xl ${
                                  isMine
                                    ? "gradient-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                                }`}
                              >
                                <p>{message.content}</p>
                                <div className={`flex items-center gap-1 mt-1 ${
                                  isMine ? "justify-end" : ""
                                }`}>
                                  <span className={`text-xs ${
                                    isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}>
                                    {formatTime(message.created_at)}
                                  </span>
                                  {isMine && (
                                    <ReadReceipt 
                                      isRead={message.is_read || false} 
                                      readAt={message.read_at || undefined}
                                      className={isMine ? "text-primary-foreground/70" : ""}
                                    />
                                  )}
                                </div>
                              </div>
                              <MessageReaction
                                messageId={message.id}
                                myProfileId={myProfileId}
                                isMine={isMine}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-2 md:p-4 border-t border-border">
                    <div className="flex items-center gap-1 md:gap-2">
                      <IcebreakerButton 
                        onSelect={handleIcebreakerSelect}
                        disabled={sendingMessage}
                      />
                      <Input
                        placeholder="כתבו הודעה..."
                        value={messageText}
                        onChange={handleMessageChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        onBlur={() => setTyping(false)}
                        className="flex-1 h-10 md:h-12 rounded-full bg-muted/50 border-none text-sm md:text-base"
                        aria-label="כתיבת הודעה"
                      />
                      <Button 
                        variant="hero" 
                        size="icon"
                        onClick={handleSend}
                        disabled={!messageText.trim() || sendingMessage}
                        aria-label="שליחת הודעה"
                      >
                        {sendingMessage ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 rotate-180" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-muted-foreground mb-4">בחרו שיחה כדי להתחיל</p>
                    {matchesWithoutConversation.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        טיפ: תוכלו להתחיל משיחה דרך <span className="font-medium">"התאמות חדשות"</span>.
                      </p>
                    ) : (
                      <Link to="/discover">
                        <Button variant="hero" size="sm" className="gap-2">
                          <Search className="w-4 h-4" aria-hidden="true" />
                          מצאו התאמות
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;