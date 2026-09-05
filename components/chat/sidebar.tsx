"use client";

import * as React from "react";
import {
  Plus,
  MessageSquare,
  ShieldCheck,
  Cpu,
  FileCheck,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  Zap,
  Lock,
  FileSearch,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Badge removed: no benchmarks shown in sidebar
// Benchmarks intentionally unused
import { cn } from "@/lib/utils";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  active?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-zinc-950 border-r border-zinc-800 transition-all duration-300 z-30 select-none",
        isOpen ? "w-72" : "w-16",
      )}
    >
      {/* Sidebar Top Header */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-zinc-800">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 font-bold text-xs shadow-inner">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-100 leading-tight">
                Deep<span className="font-mono text-zinc-400">AI</span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100">
            <ShieldCheck className="h-4 w-4" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Action Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700 shadow-sm font-medium text-xs h-10",
            !isOpen && "justify-center px-0",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {isOpen && <span>New Forensic Audit</span>}
        </Button>
      </div>

      {/* Navigation simplified: benchmarks removed */}

      {/* Sidebar List Content */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        {isOpen ? (
          sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-400">
              <FileSearch className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No recent forensic threads</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer border border-transparent",
                  session.id === activeSessionId
                    ? "bg-zinc-900 text-zinc-100 border-zinc-800 font-medium"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200",
                )}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span className="truncate flex-1">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-zinc-100 text-zinc-500 transition-opacity"
                  title="Delete thread"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          )
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-lg border transition-colors",
                  session.id === activeSessionId
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                    : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                )}
                title={session.title}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
