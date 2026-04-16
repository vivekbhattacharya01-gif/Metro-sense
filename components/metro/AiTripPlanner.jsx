'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { METRO_SYSTEM_PROMPT } from '@/lib/aiConfig.js';

const SUGGESTION_CHIPS = [
  'Dwarka to Connaught Place',
  'Cheapest route to Airport',
  'Avoid crowds, suggest best time'
];

export default function AiTripPlanner() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messageLengthRef = useRef(0);

  useEffect(() => {
    // Only auto-scroll when a NEW message is added, not on re-renders
    if (messages.length > messageLengthRef.current) {
      messageLengthRef.current = messages.length;
      // Defer scroll to next frame to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          systemPrompt: METRO_SYSTEM_PROMPT
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'I apologize, but I could not process your request. Please try again.'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I couldn\'t connect to the AI service. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-150">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white mb-4 shrink-0">
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
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 mb-4">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">How can I help you today?</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Ask me about routes, fares, timings, or any Delhi Metro query in natural language!
              </p>
              {/* Suggestion Chips */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {SUGGESTION_CHIPS.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(chip)}
                    className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 text-sm hover:bg-purple-200 dark:hover:bg-purple-800 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                        : 'bg-white dark:bg-zinc-800 border-2 border-purple-200 dark:border-purple-800 rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.role === 'user' && (
                        <User className="h-5 w-5 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 border-2 border-purple-200 dark:border-purple-800 rounded-2xl rounded-bl-md p-4">
                    <Loader2 className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 bg-white dark:bg-zinc-900">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routes, fares, or timings..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
