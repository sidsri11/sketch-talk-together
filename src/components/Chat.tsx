
import React, { useState, useRef, useEffect } from "react";
import { useDrawing } from "@/context/DrawingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const Chat: React.FC = () => {
  const { messages, sendMessage, currentUser } = useDrawing();
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col border-l h-full bg-background">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Chat</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {messages.length} messages
        </div>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.userId === "system"
                  ? "justify-center"
                  : message.userId === currentUser?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.userId === "system" ? (
                <div className="text-xs text-muted-foreground py-1 px-2 bg-muted rounded-md">
                  {message.text}
                </div>
              ) : message.userId === currentUser?.id ? (
                <div className="flex flex-col items-end max-w-[80%]">
                  <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                    <p>{message.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {message.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="bg-accent p-2 rounded-lg">
                      <div className="text-xs font-medium mb-1">
                        {message.userName}
                      </div>
                      <p>{message.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!currentUser}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !currentUser}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
