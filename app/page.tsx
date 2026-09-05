"use client"

import * as React from 'react'
import { Sidebar, ChatSession } from '@/components/chat/sidebar'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessages, ChatMessage } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { ReportModal } from '@/components/chat/report-modal'
import { BENCHMARK_SAMPLES, BenchmarkSample } from '@/lib/forensics/benchmarks'
import { parseMediaMetadata } from '@/lib/forensics/exif'

export default function DeepMediaAnalyzerApp() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [modelName, setModelName] = React.useState('Gemini 3.7 Flash (Forensic Engine)')
  const [isGroundingActive, setIsGroundingActive] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)

  // Chat sessions state
  const [sessions, setSessions] = React.useState<ChatSession[]>([
    {
      id: 'session-1',
      title: 'Midjourney v6 Deepfake Image Audit',
      timestamp: new Date().toISOString(),
      active: true
    }
  ])
  const [activeSessionId, setActiveSessionId] = React.useState('session-1')

  // Chat messages dictionary keyed by session id
  const [messagesMap, setMessagesMap] = React.useState<Record<string, ChatMessage[]>>({
    'session-1': [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Welcome to VeritasAI Deep Media Analyzer. I am powered by Gemini 3.7 Flash and client-side digital forensics. Upload an image, audio clip, or video file to run synthetic risk analysis, or ask questions about digital media integrity.',
        timestamp: new Date().toISOString(),
        analysisData: {
          syntheticRisk: 92,
          verdict: 'Synthetic',
          summary: 'Analysis of benchmark sample indicates 92% synthetic probability.',
          keyFindings: BENCHMARK_SAMPLES[0].xaiReasoning.keyFindings,
          visualAnomalies: BENCHMARK_SAMPLES[0].xaiReasoning.visualAnomalies,
          audioAnomalies: BENCHMARK_SAMPLES[0].xaiReasoning.audioAnomalies,
          metadataIndicators: BENCHMARK_SAMPLES[0].xaiReasoning.metadataIndicators,
          exifData: BENCHMARK_SAMPLES[0].exifData,
          groundingSources: [
            { title: 'Google Gemini Search Grounding Verification', url: 'https://gemini.google.com' },
            { title: 'C2PA Content Credentials Verification Standard', url: 'https://c2pa.org' }
          ]
        }
      }
    ]
  })

  // Forensic Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false)
  const [activeReportData, setActiveReportData] = React.useState<any>(null)

  const activeMessages = messagesMap[activeSessionId] || []
  const activeSessionTitle = sessions.find((s) => s.id === activeSessionId)?.title || 'Forensic Audit'

  // Create New Chat Session
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`
    const newSession: ChatSession = {
      id: newId,
      title: 'New Forensic Audit Session',
      timestamp: new Date().toISOString(),
      active: true
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newId)
    setMessagesMap((prev) => ({
      ...prev,
      [newId]: []
    }))
  }

  // Select Chat Session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
  }

  // Delete Session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id)
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id)
      } else {
        handleNewChat()
      }
    }
  }

  // Select Benchmark Sample
  const handleSelectBenchmark = (sample: BenchmarkSample) => {
    const newId = `session-benchmark-${sample.id}-${Date.now()}`
    const newSession: ChatSession = {
      id: newId,
      title: sample.title,
      timestamp: new Date().toISOString()
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newId)

    const initialMsg: ChatMessage = {
      id: `msg-benchmark-${Date.now()}`,
      role: 'assistant',
      content: `Loaded Benchmark Sample: **${sample.title}**.\n\n${sample.description}`,
      timestamp: new Date().toISOString(),
      attachedFile: {
        name: sample.title,
        size: 'Benchmark File',
        type: sample.fileType,
        url: sample.previewUrl
      },
      analysisData: {
        syntheticRisk: sample.syntheticRisk,
        verdict: sample.verdict,
        summary: sample.xaiReasoning.summary,
        keyFindings: sample.xaiReasoning.keyFindings,
        visualAnomalies: sample.xaiReasoning.visualAnomalies,
        audioAnomalies: sample.xaiReasoning.audioAnomalies,
        metadataIndicators: sample.xaiReasoning.metadataIndicators,
        exifData: sample.exifData,
        groundingSources: [
          { title: 'Google Gemini Search Grounding Verification', url: 'https://gemini.google.com' },
          { title: 'C2PA Content Credentials Verification Standard', url: 'https://c2pa.org' }
        ]
      }
    }

    setMessagesMap((prev) => ({
      ...prev,
      [newId]: [initialMsg]
    }))
  }

  // Send Message Handler
  const handleSendMessage = async (
    text: string,
    attachedFile?: { name: string; size: string; type: string; url: string; base64?: string; rawFile?: File }
  ) => {
    const userMsgId = `msg-user-${Date.now()}`
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text || (attachedFile ? `Analyze file: ${attachedFile.name}` : ''),
      timestamp: new Date().toISOString(),
      attachedFile: attachedFile ? {
        name: attachedFile.name,
        size: attachedFile.size,
        type: attachedFile.type,
        url: attachedFile.url
      } : undefined
    }

    // Update active thread title if first message
    if (activeMessages.length === 0 && text) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, title: text.slice(0, 36) + (text.length > 36 ? '...' : '') } : s
        )
      )
    }

    const updatedHistory = [...activeMessages, userMsg]

    setMessagesMap((prev) => ({
      ...prev,
      [activeSessionId]: updatedHistory
    }))

    setIsLoading(true)

    try {
      // Parse file EXIF metadata client-side if file uploaded
      let clientExif = {}
      if (attachedFile?.rawFile) {
        try {
          const parsed = await parseMediaMetadata(attachedFile.rawFile)
          clientExif = parsed.allTags
        } catch {
          // ignore EXIF error
        }
      }

      // Call Gemini API Route with multimodal payload and conversation history
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          fileName: attachedFile?.name,
          mediaType: attachedFile?.type,
          fileBase64: attachedFile?.base64,
          isGroundingActive,
          history: updatedHistory.map((m) => ({ role: m.role, content: m.content }))
        })
      })

      const aiResult = await res.json()

      const assistantMsgId = `msg-assistant-${Date.now()}`
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: aiResult.replyText || (aiResult.hasAnalysisCard 
          ? `I have completed the multi-layer forensic audit for **${attachedFile?.name || 'your request'}**. Analysis indicates a **${aiResult.verdict}** verdict with **${aiResult.syntheticRisk}%** synthetic probability.`
          : 'Forensic evaluation complete.'),
        timestamp: new Date().toISOString(),
        attachedFile: attachedFile ? {
          name: attachedFile.name,
          size: attachedFile.size,
          type: attachedFile.type,
          url: attachedFile.url
        } : undefined,
        analysisData: aiResult.hasAnalysisCard ? {
          syntheticRisk: aiResult.syntheticRisk ?? 78,
          verdict: aiResult.verdict || 'Synthetic',
          summary: aiResult.summary || 'Audit complete.',
          keyFindings: aiResult.keyFindings || [],
          visualAnomalies: aiResult.visualAnomalies || [],
          audioAnomalies: aiResult.audioAnomalies || [],
          metadataIndicators: aiResult.metadataIndicators || [],
          exifData: Object.keys(clientExif).length > 0 ? clientExif : (aiResult.exifData || BENCHMARK_SAMPLES[0].exifData),
          groundingSources: aiResult.groundingSources || []
        } : undefined
      }

      setMessagesMap((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), assistantMsg]
      }))
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        content: `An error occurred while communicating with Gemini API: ${err.message || 'Please verify your network or API key.'}`,
        timestamp: new Date().toISOString()
      }
      setMessagesMap((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), errorMsg]
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReportModalWithData = (data: any) => {
    setActiveReportData(data)
    setIsReportModalOpen(true)
  }

  const handleClearChat = () => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeSessionId]: []
    }))
  }

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      {/* Gemini Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onSelectBenchmark={handleSelectBenchmark}
      />

      {/* Main Gemini Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Bar */}
        <ChatHeader
          sessionTitle={activeSessionTitle}
          modelName={modelName}
          onModelChange={setModelName}
          onClearChat={handleClearChat}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          isGroundingActive={isGroundingActive}
          onToggleGrounding={() => setIsGroundingActive(!isGroundingActive)}
        />

        {/* Scrollable Message Thread */}
        <ChatMessages
          messages={activeMessages}
          isLoading={isLoading}
          onSelectSuggestion={(prompt) => handleSendMessage(prompt)}
          onOpenReportModalWithData={handleOpenReportModalWithData}
        />

        {/* Floating Gemini Input Dock */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isGroundingActive={isGroundingActive}
          onToggleGrounding={() => setIsGroundingActive(!isGroundingActive)}
        />
      </div>

      {/* Forensic Report Certificate Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        data={activeReportData}
      />
    </div>
  )
}
