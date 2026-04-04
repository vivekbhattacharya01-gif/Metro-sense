"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are MetroSense, an expert Delhi Metro assistant. 
You know all Delhi Metro lines: Red, Blue, Yellow, Green, Violet, Pink, Magenta.
Key interchange stations: Rajiv Chowk (Blue+Yellow), Kashmere Gate (Red+Yellow+Violet), 
Central Secretariat (Yellow+Violet), INA (Yellow+Pink+Magenta), 
Netaji Subhash Place (Red+Pink), Rajouri Garden (Blue+Pink).
Fare slabs: up to 2km=₹10, up to 5km=₹20, up to 12km=₹30, up to 21km=₹40, up to 32km=₹50, above=₹60.
Metro runs 5:30 AM to 11:30 PM. Peak hours: 8-10 AM and 5-8 PM.
Always respond with: best route, which line(s) to take, interchange stations if needed, 
estimated time, fare, and one smart tip (crowd level, best coach, exit gate, etc).
Keep responses clear, structured, and concise. Use Indian English.`;

const SUGGESTION_CHIPS = [
  "Dwarka to Connaught Place",
  "Cheapest route to Airport",
  "Avoid crowds, suggest best time"
];

export default function AiTripPlanner() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          systemPrompt: SYSTEM_PROMPT
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I couldn't process your request. Please try again."
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Sorry, I couldn&apos;t connect to the AI service. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChipClick = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-150">
      {/* Header */}
      <Card className="bg-linear-to-r from-purple-600 to-pink-600 border-0 text-white mb-4 shrink-0">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-white/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Trip Planner</h1>
              <p className="text-purple-100 text-sm">Ask anything about your Delhi Metro journey</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 rounded-full bg-linear-to-r from-purple-100 to-pink-100 mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">How can I help you today?</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Ask me about routes, fares, timings, or any Delhi Metro query in natural language!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white border-2 border-purple-200 rounded-bl-md"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <Bot className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                      )}
                      <div className={`text-sm whitespace-pre-wrap ${message.role === "user" ? "" : "text-foreground"}`}>
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <User className="h-5 w-5 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-purple-200 rounded-2xl rounded-bl-md p-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Suggestion Chips */}
        {messages.length === 0 && (
          <div className="px-4 pb-2 shrink-0">
            <div className="flex flex-wrap gap-2">
              {SUGGESTION_CHIPS.map((chip, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routes, fares, timings..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
