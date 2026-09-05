"use client"

import * as React from 'react'
import {
  ShieldCheck,
  Globe,
  FileSpreadsheet,
  Trash2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ChatHeaderProps {
  sessionTitle: string
  modelName: string
  onModelChange: (model: string) => void
  onClearChat: () => void
  onOpenReportModal: () => void
  isGroundingActive: boolean
  onToggleGrounding: () => void
}

export function ChatHeader({
  sessionTitle,
  modelName,
  onClearChat,
  onOpenReportModal,
  isGroundingActive,
  onToggleGrounding
}: ChatHeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-20 sticky top-0">
      {/* Left Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />
        <span className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-[320px] font-medium hidden sm:block">
          {sessionTitle || 'New Forensic Audit Session'}
        </span>
      </div>

      {/* Right Quick Action Controls */}
      <div className="flex items-center gap-2">
        {/* Generate Forensic Report Modal Button */}
        <Button
          onClick={onOpenReportModal}
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-100 gap-1.5 shadow-sm cursor-pointer"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-zinc-300" />
          <span>Generate Report</span>
        </Button>

        {/* Clear Chat Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          title="Clear Chat Thread"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
