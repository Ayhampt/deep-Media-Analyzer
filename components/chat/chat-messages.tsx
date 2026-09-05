"use client"

import * as React from 'react'
import {
  ShieldCheck,
  FileImage,
  FileAudio,
  FileVideo,
  ExternalLink,
  ChevronRight,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  ScanLine
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { processCanvasELA, ELAAnalysisResult } from '@/lib/forensics/ela'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachedFile?: {
    name: string
    size: string
    type: string
    url: string
  }
  analysisData?: {
    syntheticRisk: number
    verdict: 'Authentic' | 'Suspicious' | 'Synthetic'
    summary: string
    keyFindings: string[]
    visualAnomalies: string[]
    audioAnomalies: string[]
    metadataIndicators: string[]
    exifData?: Record<string, string | number>
    groundingSources?: { title: string; url: string }[]
  }
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSelectSuggestion: (prompt: string) => void
  onOpenReportModalWithData: (data: any) => void
}

function FormattedContent({ text }: { text: string }) {
  const paragraphs = text.split('\n\n')
  return (
    <div className="space-y-2.5">
      {paragraphs.map((p, i) => {
        // Bullet list item
        if (p.startsWith('* ') || p.startsWith('- ') || p.startsWith('• ')) {
          const items = p.split('\n').filter(Boolean)
          return (
            <ul key={i} className="space-y-1 my-1 pl-1">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-400">•</span>
                  <span>{item.replace(/^[-*•]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          )
        }

        // Bold text formatting
        const parts = p.split(/(\*\*.*?\*\*)/g)
        return (
          <p key={i} className="leading-relaxed whitespace-pre-wrap">
            {parts.map((part, idx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={idx} className="font-semibold text-zinc-100">{part.slice(2, -2)}</strong>
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={idx} className="font-mono bg-zinc-800 px-1 py-0.5 rounded text-xs text-zinc-200">{part.slice(1, -1)}</code>
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}

export function ChatMessages({
  messages,
  isLoading,
  onSelectSuggestion,
  onOpenReportModalWithData
}: ChatMessagesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Zero State View (Gemini UI Style) */}
      {messages.length === 0 && (
        <div className="max-w-3xl mx-auto py-12 space-y-8 animate-in fade-in-50 duration-300">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-mono text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-100" />
              <span>VeritasAI Forensic Intelligence Core</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100">
              Hello, Deep Media Analyzer.
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed">
              Upload media or select an audit prompt below to detect generative deepfakes, synthetic voice clones, ELA compression anomalies, and C2PA metadata provenance.
            </p>
          </div>

          {/* 4 Interactive Prompt Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card
              onClick={() => onSelectSuggestion('Inspect this image for Midjourney / Stable Diffusion generative deepfake artifacts and ELA manipulation heatmaps.')}
              className="p-4 bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileImage className="h-5 w-5 text-zinc-300 group-hover:text-zinc-100 transition-colors" />
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200">Image Synthetic Audit & ELA</h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Scan specular reflections, facial skin mesh, and compression differentials.
              </p>
            </Card>

            <Card
              onClick={() => onSelectSuggestion('Audit this audio recording for neural voice cloning, robotic pitch vibrato, and spectral cutoff anomalies.')}
              className="p-4 bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileAudio className="h-5 w-5 text-zinc-300 group-hover:text-zinc-100 transition-colors" />
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200">Voice Clone & Audio Spectrum</h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Analyze phase discontinuities and artificial vocoder energy falloffs.
              </p>
            </Card>

            <Card
              onClick={() => onSelectSuggestion('Perform frame-by-frame lip sync consistency check and temporal boundary audit on this video clip.')}
              className="p-4 bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileVideo className="h-5 w-5 text-zinc-300 group-hover:text-zinc-100 transition-colors" />
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200">Video Temporal Integrity</h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Audit keyframe lip sync offset, boundary flickering, and facial swaps.
              </p>
            </Card>

            <Card
              onClick={() => onSelectSuggestion('Parse EXIF provenance header, C2PA digital signatures, and camera hardware serial numbers.')}
              className="p-4 bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <ScanLine className="h-5 w-5 text-zinc-300 group-hover:text-zinc-100 transition-colors" />
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200">EXIF & C2PA Provenance</h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Verify camera hardware calibration tags and editing software logs.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Message Thread */}
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3 text-sm animate-in fade-in-50 duration-200',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {/* Assistant Avatar */}
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-100 shadow-sm mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}

            <div
              className={cn(
                'space-y-3 max-w-[88%] md:max-w-[80%]',
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              {/* User Attached Media Pill */}
              {msg.attachedFile && (
                <div className="inline-flex items-center gap-2 p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-zinc-200">
                  {msg.attachedFile.type.includes('image') ? (
                    <FileImage className="h-4 w-4 text-zinc-400" />
                  ) : msg.attachedFile.type.includes('audio') ? (
                    <FileAudio className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <FileVideo className="h-4 w-4 text-zinc-400" />
                  )}
                  <span className="truncate max-w-[160px] font-medium">
                    {msg.attachedFile.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({msg.attachedFile.size})
                  </span>
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={cn(
                  'p-4 rounded-2xl leading-relaxed text-xs md:text-sm',
                  msg.role === 'user'
                    ? 'bg-zinc-100 text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md'
                )}
              >
                <FormattedContent text={msg.content} />
              </div>

              {/* Assistant Forensic Analysis UI Card */}
              {msg.role === 'assistant' && msg.analysisData && (
                <AnalysisCard
                  data={msg.analysisData}
                  mediaFile={msg.attachedFile}
                  onOpenReportModal={() => onOpenReportModalWithData(msg.analysisData)}
                />
              )}
            </div>
          </div>
        ))}

        {/* Loading Scanning Pulse */}
        {isLoading && (
          <div className="flex gap-3 items-start animate-pulse">
            <div className="h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400">
              <ShieldCheck className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2 w-72">
              <div className="h-3 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
              <div className="h-2 bg-zinc-800 rounded w-full mt-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Inline Forensic Analysis Card Component
function AnalysisCard({
  data,
  mediaFile,
  onOpenReportModal
}: {
  data: NonNullable<ChatMessage['analysisData']>
  mediaFile?: ChatMessage['attachedFile']
  onOpenReportModal: () => void
}) {
  const [elaResult, setElaResult] = React.useState<ELAAnalysisResult | null>(null)
  const [isElaLoading, setIsElaLoading] = React.useState(false)

  React.useEffect(() => {
    if (mediaFile?.url && mediaFile.type.includes('image')) {
      setIsElaLoading(true)
      processCanvasELA(mediaFile.url)
        .then((res) => setElaResult(res))
        .catch(() => setElaResult(null))
        .finally(() => setIsElaLoading(false))
    }
  }, [mediaFile])

  return (
    <Card className="border-zinc-800 bg-zinc-950/90 overflow-hidden space-y-4 p-4 mt-2">
      {/* Risk Gauge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          {/* Risk Percentage Radar Badge */}
          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl border border-zinc-700 bg-zinc-900 font-mono">
            <span className="text-base font-bold text-zinc-100 leading-none">
              {data.syntheticRisk}%
            </span>
            <span className="text-[9px] text-zinc-400 uppercase mt-0.5">Risk</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  data.verdict === 'Authentic'
                    ? 'authentic'
                    : data.verdict === 'Suspicious'
                    ? 'suspicious'
                    : 'synthetic'
                }
                className="uppercase tracking-wider text-[10px]"
              >
                {data.verdict === 'Authentic' && <CheckCircle2 className="h-3 w-3 mr-1 inline" />}
                {data.verdict === 'Suspicious' && <AlertTriangle className="h-3 w-3 mr-1 inline" />}
                {data.verdict === 'Synthetic' && <XCircle className="h-3 w-3 mr-1 inline" />}
                {data.verdict} Media
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-tight">{data.summary}</p>
          </div>
        </div>

        <Button
          onClick={onOpenReportModal}
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 gap-1.5 cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>Full Certificate</span>
        </Button>
      </div>

      {/* Synthetic Risk Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-zinc-400">
          <span>Authentic (0%)</span>
          <span>Suspicious (50%)</span>
          <span>Synthetic (100%)</span>
        </div>
        <Progress value={data.syntheticRisk} className="h-2 bg-zinc-900 border border-zinc-800" />
      </div>

      {/* Interactive Inspection Tabs */}
      <Tabs defaultValue="reasoning" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-zinc-900 border-zinc-800 text-xs">
          <TabsTrigger value="reasoning" className="text-[11px]">
            XAI Reasoning
          </TabsTrigger>
          <TabsTrigger value="ela" className="text-[11px]">
            ELA Heatmap
          </TabsTrigger>
          <TabsTrigger value="exif" className="text-[11px]">
            EXIF Metadata
          </TabsTrigger>
        </TabsList>

        {/* XAI Natural Language Reasoning */}
        <TabsContent value="reasoning" className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-800/80 space-y-2 mt-2">
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
            Key Forensic Findings
          </h4>
          <ul className="space-y-1 text-xs text-zinc-300">
            {data.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-zinc-500 font-mono">•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>

          {data.visualAnomalies.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/60">
              <h5 className="text-[11px] font-semibold text-zinc-400 font-mono">Visual Artifacts:</h5>
              <p className="text-xs text-zinc-300">{data.visualAnomalies.join(' ')}</p>
            </div>
          )}
        </TabsContent>

        {/* ELA Heatmap Canvas Preview */}
        <TabsContent value="ela" className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-800/80 mt-2">
          {mediaFile?.url && mediaFile.type.includes('image') ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400 text-[11px]">
                  Canvas Differential Compression Map
                </span>
                {elaResult && (
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Hotspots: {elaResult.hotspotCount}
                  </Badge>
                )}
              </div>
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-black min-h-[160px] flex items-center justify-center">
                {isElaLoading ? (
                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    Calculating Canvas ELA...
                  </div>
                ) : elaResult ? (
                  <img
                    src={elaResult.elaDataUrl}
                    alt="Error Level Analysis Heatmap"
                    className="w-full max-h-56 object-contain"
                  />
                ) : (
                  <img
                    src={mediaFile.url}
                    alt="Uploaded source"
                    className="w-full max-h-56 object-contain opacity-60"
                  />
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 p-4 text-center">
              Error Level Analysis is calibrated for JPEG/PNG Image files.
            </p>
          )}
        </TabsContent>

        {/* EXIF Metadata Table */}
        <TabsContent value="exif" className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-800/80 mt-2">
          <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
            {data.exifData ? (
              Object.entries(data.exifData).map(([key, val]) => (
                <div key={key} className="flex justify-between py-0.5 border-b border-zinc-800/50 text-[11px]">
                  <span className="text-zinc-400">{key}:</span>
                  <span className="text-zinc-200 font-semibold truncate max-w-[200px]">{String(val)}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-2">No raw EXIF header preserved.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Gemini Search Grounding Chips */}
      {data.groundingSources && data.groundingSources.length > 0 && (
        <div className="pt-2 border-t border-zinc-800 space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Web Grounding Verification:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {data.groundingSources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 transition-colors"
              >
                <Search className="h-3 w-3 text-zinc-500" />
                <span className="truncate max-w-[150px]">{source.title}</span>
                <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
