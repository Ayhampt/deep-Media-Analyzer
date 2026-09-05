"use client";

import * as React from "react";
import {
  ShieldCheck,
  Download,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hash,
} from "lucide-react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  exportReportPDF,
  exportReportJSON,
  ForensicReportData,
} from "@/lib/forensics/report";
import { generateHash } from "@/lib/utils";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export function ReportModal({ isOpen, onClose, data }: ReportModalProps) {
  const [isExportingPDF, setIsExportingPDF] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);

  // Fetch analysis from server (which calls Gemini) when modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const controller = new AbortController();

    const runAnalysis = async () => {
      setIsAnalyzing(true);
      setAnalysisError(null);
      try {
        const payload = {
          prompt: data?.prompt || "",
          fileName: data?.fileName || "",
          mediaType: data?.fileType || "",
          fileBase64: data?.fileBase64 || "",
        };

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const json = await res.json();
        if (!mounted) return;

        if (!res.ok || json.error) {
          setAnalysisError(json.error || "Analysis failed");
          setAnalysis(null);
        } else {
          setAnalysis(json);
        }
      } catch (err: any) {
        if (err.name !== "AbortError")
          setAnalysisError(err.message || "Analysis error");
      } finally {
        if (mounted) setIsAnalyzing(false);
      }
    };

    runAnalysis();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isOpen, data]);

  const reportData: ForensicReportData = React.useMemo(() => {
    const timestamp = new Date().toISOString();
    const api = analysis || {};
    const defaultData = data || {};

    return {
      reportId: `VA-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp,
      fileName:
        defaultData.fileName || api.fileName || "analyzed_media_sample.png",
      fileType: defaultData.fileType || api.fileType || "image/png",
      fileSize: defaultData.fileSize || api.fileSize || "2.4 MB",
      sha256Hash: generateHash(JSON.stringify(api || defaultData)),
      syntheticRisk: Number(
        api.syntheticRisk ?? defaultData.syntheticRisk ?? 0,
      ),
      verdict: (api.verdict || defaultData.verdict || "Suspicious") as
        | "Authentic"
        | "Suspicious"
        | "Synthetic",
      modelName: api.modelName || "Gemini Forensic Engine",
      summary:
        api.summary ||
        api.replyText ||
        defaultData.summary ||
        "Forensic analysis complete.",
      keyFindings: api.keyFindings || defaultData.keyFindings || [],
      visualAnomalies: api.visualAnomalies || defaultData.visualAnomalies || [],
      audioAnomalies: api.audioAnomalies || defaultData.audioAnomalies || [],
      metadataIndicators:
        api.metadataIndicators || defaultData.metadataIndicators || [],
      exifData: api.exifData || defaultData.exifData || {},
    };
  }, [analysis, data]);

  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportReportPDF(
        reportData,
        `VeritasAI-Certificate-${reportData.reportId}.pdf`,
      );
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadJSON = () => {
    exportReportJSON(
      reportData,
      `VeritasAI-Evidence-${reportData.reportId}.json`,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
        {/* Analysis status banner */}
        {isAnalyzing && (
          <div className="p-3 bg-zinc-900/40 border-b border-zinc-800 text-zinc-300 text-sm flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-zinc-300" />
            <span>Analyzing media with Gemini forensic engine…</span>
          </div>
        )}

        {analysisError && (
          <div className="p-3 bg-red-900/20 border-b border-red-800 text-red-300 text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-300" />
            <span>Error: {analysisError}</span>
          </div>
        )}

        {/* Printable Certificate Container */}
        <div
          id="forensic-report-certificate"
          className="p-6 space-y-6 bg-zinc-950"
        >
          {/* Certificate Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-100 font-bold shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-zinc-100">
                    FORENSIC VERIFICATION CERTIFICATE
                  </h2>
                  <Badge
                    variant="outline"
                    className="font-mono text-[9px] uppercase"
                  >
                    OFFICIAL AUDIT
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Report ID: {reportData.reportId} • Issued:{" "}
                  {reportData.timestamp.slice(0, 10)}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-zinc-500">
              <p>VERITAS AI PLATFORM</p>
              <p>FORENSIC MEDIA AUDIT</p>
            </div>
          </div>

          {/* Verdict Highlight & Risk Radar Gauge */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  CLASSIFICATION VERDICT:
                </span>
                <Badge
                  variant={
                    reportData.verdict === "Authentic"
                      ? "authentic"
                      : reportData.verdict === "Suspicious"
                        ? "suspicious"
                        : "synthetic"
                  }
                  className="text-xs px-2.5 py-0.5 uppercase tracking-wider font-bold"
                >
                  {reportData.verdict}
                </Badge>
              </div>
              <p className="text-xs text-zinc-300 max-w-md">
                {reportData.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
              <div className="text-center font-mono">
                <div className="text-3xl font-bold text-zinc-100">
                  {reportData.syntheticRisk}%
                </div>
                <div className="text-[9px] text-zinc-400 uppercase">
                  SYNTHETIC RISK
                </div>
              </div>
            </div>
          </div>

          {/* SHA-256 Cryptographic Evidence Block */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 font-mono text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="flex items-center gap-1">
                <Hash className="h-3 w-3" /> SHA-256 Fingerprint:
              </span>
              <span>Cryptographic Immutable Hash</span>
            </div>
            <p className="text-zinc-200 break-all text-[11px] font-semibold">
              {reportData.sha256Hash}
            </p>
          </div>

          {/* Explainable AI Findings Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                Key Forensic Findings
              </h3>
              <ul className="space-y-1 text-xs text-zinc-300">
                {reportData.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-zinc-500 font-mono">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                EXIF & C2PA Provenance Header
              </h3>
              <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto">
                {Object.entries(reportData.exifData).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between py-0.5 border-b border-zinc-800/40 text-[11px]"
                  >
                    <span className="text-zinc-400">{key}:</span>
                    <span className="text-zinc-200 font-semibold truncate max-w-[150px]">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal Controls */}
        <DialogFooter className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleDownloadJSON}
            variant="outline"
            size="sm"
            className="text-xs font-medium border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 gap-1.5 cursor-pointer"
            disabled={isAnalyzing || Boolean(analysisError)}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Export JSON Bundle</span>
          </Button>

          <Button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            variant="default"
            size="sm"
            className="text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 gap-1.5 cursor-pointer shadow"
          >
            <Download className="h-3.5 w-3.5" />
            <span>
              {isExportingPDF
                ? "Generating PDF..."
                : "Download PDF Certificate"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
