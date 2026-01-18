import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Phone, Video, MoreVertical, Smile, Image, Paperclip } from "lucide-react";
import { useState } from "react";
import profile1 from "@/assets/profiles/profile1.jpg";
import profile2 from "@/assets/profiles/profile2.jpg";
import profile3 from "@/assets/profiles/profile3.jpg";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "מיכל",
    avatar: profile1,
    lastMessage: "היי! איך היום שלך? 😊",
    time: "עכשיו",
    unread: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "דניאל",
    avatar: profile2,
    lastMessage: "כיף היה לדבר איתך!",
    time: "לפני שעה",
    unread: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "נועה",
    avatar: profile3,
    lastMessage: "נשמע מעולה, בואי נקבע",
    time: "אתמול",
    unread: 0,
    isOnline: true,
  },
];

const sampleMessages: Message[] = [
  { id: "1", text: "היי! ראיתי שאנחנו שניים אוהבים קפה ☕", isMine: false, time: "10:30" },
  { id: "2", text: "היי! כן, קפה זה הדבר הכי חשוב בחיים 😄", isMine: true, time: "10:32" },
  { id: "3", text: "לגמרי! יש לך מקום מועדף בתל אביב?", isMine: false, time: "10:33" },
  { id: "4", text: "יש קפה קטן וחמוד ברחוב דיזנגוף, נקרא 'הפינה'", isMine: true, time: "10:35" },
  { id: "5", text: "היי! איך היום שלך? 😊", isMine: false, time: "עכשיו" },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(sampleMessages);

  const handleSend = () => {
    if (!messageText.trim()) return;
    
    setMessages([...messages, {
      id: Date.now().toString(),
      text: messageText,
      isMine: true,
      time: "עכשיו"
    }]);
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-6">
        <div className="bg-card rounded-3xl shadow-card overflow-hidden h-[calc(100vh-120px)]">
          <div className="grid md:grid-cols-[360px_1fr] h-full">
            {/* Conversations List */}
            <div className="border-l border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">הודעות</h2>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="חפש בהודעות..." 
                    className="pr-10 bg-muted/50 border-none"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-100px)]">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={conv.avatar} 
                        alt={conv.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground">{conv.name}</span>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedConversation.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.isOnline ? "מחובר/ת" : "לא מחובר/ת"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                          message.isMine
                            ? "gradient-primary text-primary-foreground rounded-bl-sm"
                            : "bg-muted text-foreground rounded-br-sm"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Image className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="כתבו הודעה..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 h-12 rounded-full bg-muted/50 border-none"
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="hero" 
                      size="icon"
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">בחרו שיחה להתחיל</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
