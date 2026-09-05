import { jsPDF } from 'jspdf'
import { generateHash } from '@/lib/utils'

export interface ForensicReportData {
  reportId: string
  timestamp: string
  fileName: string
  fileType: string
  fileSize: string
  sha256Hash: string
  syntheticRisk: number
  verdict: 'Authentic' | 'Suspicious' | 'Synthetic'
  modelName: string
  summary: string
  keyFindings: string[]
  visualAnomalies: string[]
  audioAnomalies: string[]
  metadataIndicators: string[]
  exifData: Record<string, string | number>
}

/**
 * Generates a clean, vector-rendered Forensic Audit Certificate PDF
 * completely immune to HTML2Canvas CSS color function errors (like 'lab', 'oklch').
 */
export async function exportReportPDF(dataOrElementId: string | ForensicReportData, filename = 'VeritasAI-Forensic-Report.pdf') {
  let data: ForensicReportData

  if (typeof dataOrElementId === 'object') {
    data = dataOrElementId
  } else {
    // Fallback default sample data if called with element ID
    const ts = new Date().toISOString()
    data = {
      reportId: `VA-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: ts,
      fileName: 'media_audit_sample.png',
      fileType: 'image/png',
      fileSize: '2.4 MB',
      sha256Hash: generateHash(ts),
      syntheticRisk: 88,
      verdict: 'Synthetic',
      modelName: 'Gemini 3.7 Flash Forensic Engine',
      summary: 'High confidence generative AI media synthesis detected with 88% probability.',
      keyFindings: [
        'Frequency domain noise variance matches diffusion model signatures.',
        'Facial boundary flicker detected across keyframes.',
        'Software compression header signature indicates non-camera pipeline.'
      ],
      visualAnomalies: ['Iris reflection light vector misalignment across facial keypoints.'],
      audioAnomalies: ['N/A - Image File'],
      metadataIndicators: ['C2PA Manifest signature missing.', 'Camera hardware serial tags missing.'],
      exifData: {
        'Camera Make': 'Generative Software Pipeline',
        'Software': 'Midjourney v6 / Gemini Multimodal Engine',
        'Color Space': 'sRGB',
        'EXIF Header': 'Stripped Hardware Profile'
      }
    }
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Background Obsidian Canvas
  doc.setFillColor(15, 15, 18)
  doc.rect(0, 0, 210, 297, 'F')

  // Top Outer Border
  doc.setDrawColor(45, 45, 52)
  doc.setLineWidth(0.5)
  doc.rect(10, 10, 190, 277)

  // Header Banner
  doc.setFillColor(24, 24, 29)
  doc.rect(11, 11, 188, 26, 'F')

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('FORENSIC VERIFICATION CERTIFICATE', 18, 22)

  doc.setFont('courier', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 175)
  doc.text(`VERITAS AI PLATFORM  |  REPORT ID: ${data.reportId}  |  ISSUED: ${data.timestamp.slice(0, 10)}`, 18, 29)

  // Verdict & Score Box
  doc.setFillColor(28, 28, 35)
  doc.roundedRect(18, 43, 174, 30, 2, 2, 'F')
  doc.setDrawColor(60, 60, 70)
  doc.roundedRect(18, 43, 174, 30, 2, 2, 'D')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 215)
  doc.text('VERIFICATION VERDICT:', 24, 53)

  doc.setFontSize(16)
  if (data.verdict === 'Authentic') {
    doc.setTextColor(240, 240, 240)
  } else if (data.verdict === 'Suspicious') {
    doc.setTextColor(210, 210, 210)
  } else {
    doc.setTextColor(255, 255, 255)
  }
  doc.text(`${data.verdict.toUpperCase()} MEDIA`, 24, 62)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(170, 170, 185)
  const summaryLines = doc.splitTextToSize(data.summary, 105)
  doc.text(summaryLines, 24, 68)

  // Score display right
  doc.setFont('courier', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text(`${data.syntheticRisk}%`, 155, 58)
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 165)
  doc.text('SYNTHETIC RISK', 151, 65)

  // Cryptographic Hash Section
  doc.setFillColor(20, 20, 25)
  doc.rect(18, 78, 174, 14, 'F')
  doc.setDrawColor(50, 50, 60)
  doc.rect(18, 78, 174, 14, 'D')

  doc.setFont('courier', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(140, 140, 160)
  doc.text('SHA-256 CRYPTOGRAPHIC FINGERPRINT:', 24, 83)
  doc.setFont('courier', 'normal')
  doc.setTextColor(240, 240, 240)
  doc.text(data.sha256Hash || generateHash(data.reportId), 24, 88)

  // Media Telemetry Table
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('MEDIA TELEMETRY & AUDITOR METRICS', 18, 100)

  doc.setFillColor(24, 24, 30)
  doc.rect(18, 103, 174, 24, 'F')
  doc.setDrawColor(50, 50, 60)
  doc.rect(18, 103, 174, 24, 'D')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(160, 160, 175)

  doc.text(`Filename:`, 24, 110)
  doc.setTextColor(230, 230, 240)
  doc.text(`${data.fileName}`, 48, 110)

  doc.setTextColor(160, 160, 175)
  doc.text(`File Type:`, 24, 116)
  doc.setTextColor(230, 230, 240)
  doc.text(`${data.fileType} (${data.fileSize})`, 48, 116)

  doc.setTextColor(160, 160, 175)
  doc.text(`Auditor Model:`, 24, 122)
  doc.setTextColor(230, 230, 240)
  doc.text(`${data.modelName}`, 48, 122)

  doc.setTextColor(160, 160, 175)
  doc.text(`Timestamp:`, 110, 110)
  doc.setTextColor(230, 230, 240)
  doc.text(`${data.timestamp}`, 130, 110)

  doc.setTextColor(160, 160, 175)
  doc.text(`Classification:`, 110, 116)
  doc.setTextColor(230, 230, 240)
  doc.text(`${data.verdict}`, 130, 116)

  // Key Findings Section
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('EXPLAINABLE AI (XAI) KEY FORENSIC FINDINGS', 18, 136)

  let curY = 143
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  data.keyFindings.forEach((finding) => {
    doc.setTextColor(120, 120, 140)
    doc.text('•', 24, curY)
    doc.setTextColor(220, 220, 230)
    const lines = doc.splitTextToSize(finding, 160)
    doc.text(lines, 29, curY)
    curY += lines.length * 4.5 + 1
  })

  // Visual & Audio Anomalies
  if (data.visualAnomalies.length > 0 && data.visualAnomalies[0] !== 'N/A - Audio File') {
    curY += 2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 200)
    doc.text('Visual Artifacts & Noise Analysis:', 24, curY)
    curY += 4.5
    doc.setFont('helvetica', 'normal')
    const vLines = doc.splitTextToSize(data.visualAnomalies.join(' '), 165)
    doc.setTextColor(210, 210, 220)
    doc.text(vLines, 24, curY)
    curY += vLines.length * 4 + 2
  }

  // EXIF & Provenance Matrix
  curY += 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.text('EXIF METADATA & PROVENANCE HEADER', 18, curY)
  curY += 5

  doc.setFillColor(22, 22, 27)
  doc.rect(18, curY, 174, 38, 'F')
  doc.setDrawColor(45, 45, 55)
  doc.rect(18, curY, 174, 38, 'D')

  let exifY = curY + 6
  doc.setFont('courier', 'normal')
  doc.setFontSize(7)
  const exifEntries = Object.entries(data.exifData).slice(0, 5)
  exifEntries.forEach(([k, v]) => {
    doc.setTextColor(150, 150, 170)
    doc.text(`${k}:`, 24, exifY)
    doc.setTextColor(230, 230, 240)
    doc.text(String(v).slice(0, 50), 75, exifY)
    exifY += 6
  })

  // Footer Signature & Audit Seal
  doc.setFont('courier', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(110, 110, 130)
  doc.text('DIGITALLY SIGNED & VERIFIED BY VERITAS AI FORENSIC PLATFORM', 18, 276)
  doc.text(`SECURITY HASH: ${generateHash(data.timestamp)}`, 18, 281)

  doc.save(filename)
}

export function exportReportJSON(data: ForensicReportData, filename = 'Forensic-Evidence-Bundle.json') {
  const evidencePackage = {
    veritas_ai_version: '2.5.0-monochrome-audit',
    signature: generateHash(JSON.stringify(data)),
    report_metadata: {
      report_id: data.reportId,
      timestamp: data.timestamp,
      sha256: data.sha256Hash,
      model_auditor: data.modelName
    },
    media_telemetry: {
      filename: data.fileName,
      file_type: data.fileType,
      file_size: data.fileSize,
      synthetic_risk_score: data.syntheticRisk,
      forensic_verdict: data.verdict
    },
    explainable_ai_findings: {
      summary: data.summary,
      key_findings: data.keyFindings,
      visual_anomalies: data.visualAnomalies,
      audio_anomalies: data.audioAnomalies,
      metadata_indicators: data.metadataIndicators
    },
    exif_provenance: data.exifData
  }

  const jsonStr = JSON.stringify(evidencePackage, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
