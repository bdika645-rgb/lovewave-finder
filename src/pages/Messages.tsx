import Navbar from "@/components/Navbar";
import ReportDialog from "@/components/ReportDialog";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Send, Search, Loader2, MessageCircle, Heart, ChevronRight, ChevronDown, SearchX, Mic, Trash2, Reply, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useMatches } from "@/hooks/useMatches";
import { useTypingStatus } from "@/hooks/useTypingStatus";
import { Link, useLocation } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const location = useLocation();
  const { conversations, loading: conversationsLoading, createOrGetConversation, getMyProfileId, refetch: refetchConversations } = useConversations();
  const { matches, loading: matchesLoading } = useMatches();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    (location.state as any)?.conversationId || null
  );
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [conversationFilter, setConversationFilter] = useState<"all" | "unread">("all");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<{ id: string; content: string; senderName: string } | null>(null);
  const [reportProfileId, setReportProfileId] = useState<string | null>(null);
  const [reportProfileName, setReportProfileName] = useState<string>("");
  const typingStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { messages, loading: messagesLoading, sendMessage, markAsRead, refetch: refetchMessages } = useMessages(selectedConversationId);
  const { othersTyping, setTyping } = useTypingStatus(selectedConversationId, myProfileId);

  // Get selected conversation details
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Scroll to bottom when messages change (only if near bottom)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowScrollToBottom(true);
    }
  }, [messages]);

  // Track scroll position for scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      setShowScrollToBottom(!isNearBottom);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Mark messages as read only when:
  // 1. A new conversation is selected, OR
  // 2. New unread messages from others arrive in the active conversation
  const lastSeenConvRef = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedConversationId || messages.length === 0) return;
    const hasUnread = messages.some(m => !m.is_read && m.sender_id !== myProfileId);
    if (!hasUnread && lastSeenConvRef.current === selectedConversationId) return;
    lastSeenConvRef.current = selectedConversationId;
    markAsRead();
  }, [selectedConversationId, messages, myProfileId, markAsRead]);

  useEffect(() => {
    getMyProfileId().then(setMyProfileId);
  }, [getMyProfileId]);

  // Handle typing indicator with auto-stop after 2s of silence
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    if (e.target.value.length > 0) {
      setTyping(true);
      // Clear existing stop-typing timer and reset it
      if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 2000);
    } else {
      if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
      setTyping(false);
    }
  }, [setTyping]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    if (!messageText.trim() || !selectedConversationId || sendingMessage) return;
    
    setTyping(false);
    setSendingMessage(true);
    const { error } = await sendMessage(messageText, replyToMessage?.id);
    setSendingMessage(false);

    if (error) {
      toast.error("שגיאה בשליחת ההודעה");
      return;
    }

    setMessageText("");
    setReplyToMessage(null);
    // Reset textarea height safely
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.minHeight = '';
    }
    // No need to call refetchConversations — realtime handles the update
  }, [messageText, selectedConversationId, sendingMessage, sendMessage, replyToMessage, setTyping]);

  const handleSelectConversation = (convId: string) => {
    // Stop typing indicator when switching conversations
    if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
    setTyping(false);
    setSelectedConversationId(convId);
    setReplyToMessage(null);
    setMessageText("");
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

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.otherProfile?.name?.includes(searchQuery) || 
      conv.lastMessage?.content?.includes(searchQuery);
    const matchesFilter = conversationFilter === "all" || conv.unreadCount > 0;
    return matchesSearch && matchesFilter;
  });
  
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Keyboard navigation (J/K like Gmail, Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only when not typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      
      const currentIndex = filteredConversations.findIndex(c => c.id === selectedConversationId);
      
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < filteredConversations.length - 1 ? currentIndex + 1 : currentIndex;
        if (filteredConversations[nextIndex]) {
          setSelectedConversationId(filteredConversations[nextIndex].id);
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        if (filteredConversations[prevIndex]) {
          setSelectedConversationId(filteredConversations[prevIndex].id);
        }
      } else if (e.key === 'Escape' && selectedConversationId) {
        setSelectedConversationId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedConversationId, filteredConversations]);

  const hasActiveSearch = searchQuery.trim().length > 0;

  // Filter matches that don't have a conversation yet
  const matchesWithoutConversation = matches.filter(match => 
    !conversations.some(conv => conv.otherProfile?.id === match.matchedProfile?.id)
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "עכשיו";
    if (minutes < 60) return `לפני ${minutes} דק'`;
    if (hours < 24) return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return "אתמול";
    if (days < 7) return date.toLocaleDateString('he-IL', { weekday: 'short' });
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
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
                <div className="p-4 border-b border-border space-y-3">
                  <h2 className="font-display text-lg md:text-xl font-bold text-foreground">שיחות</h2>
                  
                  {/* Filter Tabs - Like WhatsApp */}
                  <div className="flex gap-2">
                    <Button 
                      variant={conversationFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConversationFilter("all")}
                      className="rounded-full text-sm h-8"
                    >
                      הכל
                    </Button>
                    <Button 
                      variant={conversationFilter === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConversationFilter("unread")}
                      className="rounded-full text-sm h-8"
                    >
                      לא נקראו {unreadCount > 0 && `(${unreadCount})`}
                    </Button>
                  </div>
                  
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
                      {conversationFilter === "unread" ? (
                        <>
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                          <p className="mb-2 font-medium">אין הודעות שלא נקראו 🎉</p>
                          <p className="text-sm mb-4">כל ההודעות נקראו! תוכל/י לחזור לצפייה בכל השיחות.</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConversationFilter("all")}
                            className="mx-auto"
                          >
                            הצג את כל השיחות
                          </Button>
                        </>
                      ) : (
                        <>
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
                        </>
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
                            : "hover:bg-muted/50 hover:-translate-x-1"
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
                              {conv.lastMessage 
                                ? (conv.lastMessage.sender_id === myProfileId ? "אתה: " : "") + conv.lastMessage.content 
                                : "התחילו לשוחח!"}
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
                        onReport={() => {
                          setReportProfileId(selectedConversation.otherProfile?.id || null);
                          setReportProfileName(selectedConversation.otherProfile?.name || '');
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
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth relative"
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

                      let lastDateLabel = "";
                      return filteredMessages.map((message) => {
                        const isMine = message.sender_id === myProfileId;
                        
                        // Date separator logic
                        const msgDate = new Date(message.created_at);
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        
                        let dateLabel = "";
                        if (msgDate.toDateString() === today.toDateString()) {
                          dateLabel = "היום";
                        } else if (msgDate.toDateString() === yesterday.toDateString()) {
                          dateLabel = "אתמול";
                        } else {
                          dateLabel = msgDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
                        }
                        
                        const showDateSeparator = dateLabel !== lastDateLabel;
                        lastDateLabel = dateLabel;
                        
                        return (
                          <div key={message.id}>
                            {showDateSeparator && (
                              <div className="flex items-center justify-center my-4" aria-label={`הודעות מ-${dateLabel}`}>
                                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                  {dateLabel}
                                </span>
                              </div>
                            )}
                          <div
                            key={message.id}
                            className={`flex items-end gap-1 ${isMine ? "justify-end flex-row-reverse" : "justify-start"} group`}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={`px-4 py-3 rounded-2xl select-none ${
                                  isMine
                                    ? "gradient-primary text-primary-foreground rounded-br-sm"
                                    : "bg-muted text-foreground rounded-bl-sm"
                                }`}
                                onDoubleClick={() => {
                                  if (myProfileId && !isMine) {
                                    supabase.from("message_reactions").upsert({
                                      message_id: message.id,
                                      profile_id: myProfileId,
                                      emoji: "❤️",
                                    }, { onConflict: "message_id,profile_id" })
                                    .then(() => toast.success("❤️"));
                                  }
                                }}
                              >
                                {/* Reply quote */}
                                {(message as any).reply_to && (() => {
                                  const repliedMsg = messages.find(m => m.id === (message as any).reply_to);
                                  if (!repliedMsg) return null;
                                  const isRepliedMine = repliedMsg.sender_id === myProfileId;
                                  return (
                                    <div className={`mb-2 px-3 py-1.5 rounded-lg text-xs border-r-2 ${
                                      isMine 
                                        ? "bg-primary-foreground/10 border-primary-foreground/40" 
                                        : "bg-foreground/5 border-primary/40"
                                    }`}>
                                      <p className={`font-medium mb-0.5 ${isMine ? "text-primary-foreground/80" : "text-primary"}`}>
                                        {isRepliedMine ? "אתה" : selectedConversation?.otherProfile.name}
                                      </p>
                                      <p className={`line-clamp-2 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                        {repliedMsg.content}
                                      </p>
                                    </div>
                                  );
                                })()}
                                <p className="whitespace-pre-wrap">{message.content}</p>
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
                            {/* Action buttons - outside the bubble */}
                            <div className={`flex ${isMine ? "flex-row-reverse" : "flex-row"} gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mb-1`}>
                              <button
                                onClick={() => setReplyToMessage({
                                  id: message.id,
                                  content: message.content,
                                  senderName: isMine ? "אתה" : (selectedConversation?.otherProfile.name || ""),
                                })}
                                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                                aria-label="השב להודעה"
                              >
                                <Reply className="w-3.5 h-3.5" />
                              </button>
                              {isMine && (
                                <button
                                  onClick={() => setDeleteMessageId(message.id)}
                                  className="p-1.5 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive"
                                  aria-label="מחק הודעה"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          </div>
                        );
                      });
                    })()}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll to bottom button */}
                  {showScrollToBottom && messages.length > 0 && (
                    <div className="relative">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full shadow-lg z-10 w-10 h-10"
                        onClick={scrollToBottom}
                        aria-label="גלול להודעות אחרונות"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </Button>
                    </div>
                  )}

                  {/* Reply Preview */}
                  {replyToMessage && (
                    <div className="px-3 md:px-4 pt-2 border-t border-border">
                      <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2">
                        <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-primary">{replyToMessage.senderName}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{replyToMessage.content}</p>
                        </div>
                        <button
                          onClick={() => setReplyToMessage(null)}
                          className="p-1 hover:bg-muted rounded-full shrink-0"
                          aria-label="בטל תגובה"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-2 md:p-4 border-t border-border">
                    <div className="flex items-center gap-1 md:gap-2">
                      <IcebreakerButton 
                        onSelect={handleIcebreakerSelect}
                        disabled={sendingMessage}
                      />
                      <textarea
                        ref={textareaRef}
                        placeholder="כתבו הודעה..."
                        value={messageText}
                        onChange={handleMessageChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        onBlur={() => setTyping(false)}
                        className="flex-1 min-h-[40px] md:min-h-[48px] max-h-[120px] rounded-2xl bg-muted/50 border-none text-sm md:text-base px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                        aria-label="כתיבת הודעה"
                        rows={1}
                      />
                      {messageText.trim() ? (
                        <Button 
                          variant="hero" 
                          size="icon"
                          onClick={handleSend}
                          disabled={sendingMessage}
                          aria-label="שליחת הודעה"
                        >
                          {sendingMessage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5 rotate-180" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-muted-foreground"
                          onClick={() => toast.info("הודעות קוליות - בקרוב! 🎤")}
                          aria-label="הודעה קולית (בקרוב)"
                        >
                          <Mic className="w-5 h-5" />
                        </Button>
                      )}
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

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog open={!!deleteMessageId} onOpenChange={() => setDeleteMessageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את ההודעה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את ההודעה לצמיתות. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteMessageId) return;
                const { error } = await supabase
                  .from("messages")
                  .delete()
                  .eq("id", deleteMessageId)
                  .eq("sender_id", myProfileId);
                if (error) {
                  toast.error("שגיאה במחיקת ההודעה");
                } else {
                  toast.success("ההודעה נמחקה");
                  refetchMessages();
                  refetchConversations();
                }
                setDeleteMessageId(null);
              }}
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Dialog */}
      {reportProfileId && (
        <ReportDialog
          open={!!reportProfileId}
          onOpenChange={(open) => { if (!open) setReportProfileId(null); }}
          profileId={reportProfileId}
          profileName={reportProfileName}
        />
      )}
    </div>
  );
};

export default Messages;