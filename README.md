# Deep Media Analyzer 

A lightweight Next.js application for forensic analysis of media using multimodal AI. The app performs EXIF/ELA checks locally, and uses the Google Gemini API for multimodal forensic reasoning. When Gemini is rate-limited, the server can optionally fall back to OpenAI.

## Features

- Local EXIF & ELA processing for quick telemetry
- Multimodal forensic reasoning via the Gemini API (`@google/genai`)
- OpenAI fallback when Gemini rate limits are hit (optional)
- Exportable forensic reports as PDF and JSON bundles
- Clean UI components: sidebar, chat/history, report certificate modal

## Quick Start

Requirements

- Node.js 18+ (or compatible with Next 16)
- npm or yarn

Install dependencies

```bash
npm install
# or
# yarn
```

Environment variables

Create a `.env.local` (or edit `.env`) at the project root with at least the Gemini API key:

```env
# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# Optional: OpenAI API key (used as fallback when Gemini is rate limited)
OPENAI_API_KEY="sk-..."
```

Important: keep your API keys secret and do not commit them to source control.

Run the dev server

```bash
npm run dev
```

Build for production

```bash
npm run build
npm run start
```

Lint

```bash
npm run lint
```

## Usage

- Open the app in the browser (default http://localhost:3000).
- Use the sidebar to create a new forensic audit and upload media (or paste a base64 payload).
- When requesting a report, the app sends a POST to `/api/analyze` which calls Gemini with a strict JSON schema.
- If Gemini responds or the analysis completes, the UI displays a report certificate modal. You can export the certificate as PDF or a JSON evidence bundle.

### API Endpoint

POST /api/analyze

Payload example:

```json
{
  "prompt": "Full forensic analysis",
  "fileName": "sample.png",
  "mediaType": "image/png",
  "fileBase64": "data:image/png;base64,...",
  "isGroundingActive": false
}
```

Response (expected JSON schema)

```json
{
  "replyText": "string",
  "syntheticRisk": 0.0,
  "verdict": "Authentic|Suspicious|Synthetic",
  "summary": "string",
  "keyFindings": ["string"],
  "visualAnomalies": ["string"],
  "audioAnomalies": ["string"],
  "hasAnalysisCard": true
}
```

## Implementation Notes

- The Gemini integration lives at `app/api/analyze/route.ts` and uses `@google/genai`.
- On 429 / RESOURCE_EXHAUSTED errors, the route attempts an OpenAI fallback if `OPENAI_API_KEY` is configured.
- The UI report modal is `components/chat/report-modal.tsx` and builds `ForensicReportData` from the API response. PDF/JSON export utilities are in `lib/forensics/report.ts`.
- The sidebar component was simplified to remove preloaded benchmark items; see `components/chat/sidebar.tsx`.

## Troubleshooting

- If analysis fails with `Missing or Invalid API Key`, ensure `GEMINI_API_KEY` is set in `.env.local`.
- If the OpenAI fallback is desired, set `OPENAI_API_KEY` (the fallback will try OpenAI and then a graceful static fallback).
- If responses are not valid JSON, the API route strips common code fences and attempts JSON.parse; malformed model responses may still fail parsing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run formatting and linting locally
4. Open a PR with a clear description

## License

This repository has no license file. Add or confirm a license before publishing.

## Contact

If you need help, open an issue or reach out to the maintainer in your team.
