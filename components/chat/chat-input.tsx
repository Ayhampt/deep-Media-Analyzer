"use client"

import * as React from 'react'
import {
  Paperclip,
  ArrowUp,
  Globe,
  X,
  FileImage,
  FileAudio,
  FileVideo,
  Sparkles,
  Layers,
  ScanLine
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatBytes, cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (text: string, attachedFile?: {
    name: string
    size: string
    type: string
    url: string
    base64?: string
    rawFile?: File
  }) => void
  isLoading: boolean
  isGroundingActive: boolean
  onToggleGrounding: () => void
}

export function ChatInput({
  onSendMessage,
  isLoading,
  isGroundingActive,
  onToggleGrounding
}: ChatInputProps) {
  const [text, setText] = React.useState('')
  const [attachedFile, setAttachedFile] = React.useState<{
    name: string
    size: string
    type: string
    url: string
    base64?: string
    rawFile?: File
  } | null>(null)

  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setAttachedFile({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type,
        url,
        base64,
        rawFile: file
      })
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!text.trim() && !attachedFile) return

    onSendMessage(text, attachedFile || undefined)
    setText('')
    setAttachedFile(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="p-3 md:p-4 bg-zinc-950 border-t border-zinc-800/80 sticky bottom-0 z-20"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,audio/*,video/*"
        className="hidden"
      />

      <div className="max-w-4xl mx-auto space-y-2">
        {/* Floating Gemini Input Dock Pill */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            'relative rounded-2xl border bg-zinc-900/90 backdrop-blur-md p-2 transition-all shadow-xl',
            isDragging
              ? 'border-zinc-100 ring-2 ring-zinc-400 bg-zinc-800/90'
              : 'border-zinc-800 hover:border-zinc-700'
          )}
        >
          {/* Attached File Preview Pill inside Input Dock */}
          {attachedFile && (
            <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-xl bg-zinc-950 border border-zinc-800 w-fit text-xs text-zinc-200 animate-in fade-in-50">
              {attachedFile.type.includes('image') ? (
                <FileImage className="h-4 w-4 text-zinc-400" />
              ) : attachedFile.type.includes('audio') ? (
                <FileAudio className="h-4 w-4 text-zinc-400" />
              ) : (
                <FileVideo className="h-4 w-4 text-zinc-400" />
              )}
              <span className="font-medium truncate max-w-[200px]">{attachedFile.name}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({attachedFile.size})</span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="ml-1 p-0.5 hover:text-zinc-100 text-zinc-500 rounded cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* File Attach Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 shrink-0 cursor-pointer rounded-xl"
              title="Attach Media File (Image, Audio, Video)"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Textarea Input */}
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VeritasAI to analyze media, run ELA, or inspect metadata..."
              className="min-h-[44px] max-h-32 border-0 bg-transparent focus-visible:ring-0 text-xs md:text-sm placeholder:text-zinc-500 py-2.5 px-1 leading-relaxed"
            />

            {/* Search Grounding Quick Toggle */}

            {/* Submit Send Button */}
            <Button
              type="submit"
              disabled={isLoading || (!text.trim() && !attachedFile)}
              size="icon"
              className="h-9 w-9 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-xl shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow"
            >
              <ArrowUp className="h-4 w-4 font-bold" />
            </Button>
          </div>
        </form>

        {/* Quick Mode Preset Chips */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 font-mono">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <button
              onClick={() => setText('Run client-side Error Level Analysis (ELA) canvas scan on uploaded image.')}
              className="hover:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Layers className="h-3 w-3" />
              <span>Deep ELA</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setText('Extract C2PA cryptographic headers and camera lens EXIF calibration details.')}
              className="hover:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <ScanLine className="h-3 w-3" />
              <span>C2PA EXIF</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setText('Audit audio waveform spectrogram for neural vocoder energy drop-offs.')}
              className="hover:text-zinc-300 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Sparkles className="h-3 w-3" />
              <span>Audio Spectrum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
``