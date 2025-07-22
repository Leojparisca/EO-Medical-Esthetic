'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { type ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User, Stethoscope, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChatMessagesProps {
  history: ChatMessage[];
  loading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ history, loading, scrollAreaRef }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {history.map((msg, index) => (
          <div key={index}>
            <div
              className={cn(
                'flex items-end gap-2',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="p-2 rounded-full bg-card border text-primary self-start">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={cn(
                  'p-3 rounded-2xl max-w-sm shadow-sm',
                  msg.role === 'assistant'
                    ? 'bg-card rounded-bl-none'
                    : 'bg-gradient-gold text-primary-foreground rounded-br-none'
                )}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="p-2 rounded-full bg-gray-200 text-gray-700 self-start">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-12">
                {msg.suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.slug}
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-full"
                  >
                    <Link href={`/booking?service=${suggestion.slug}`}>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      {suggestion.name}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="p-2 rounded-full bg-card border text-primary self-start">
              <Bot className="h-5 w-5" />
            </div>
            <div className="p-3 rounded-2xl bg-card rounded-bl-none flex items-center gap-2 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pensando...</span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
