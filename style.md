# Style & Design System Guide (style.md)
## Deep-Media-Analyzer (Monochrome Gemini Chat UI with Shadcn UI Components)

### 1. Theme Philosophy & Aesthetic
The UI for **Deep-Media-Analyzer (VeritasAI)** is modeled after the sleek, modern **Gemini Web UI**. It uses a **Monochrome** color system (Black, Obsidian, Zinc, Off-White) with official Shadcn UI component patterns. 

- **Layout**: Left collapsible sidebar (History, Models, Settings) + Central Gemini-style Chat Feed + Bottom Floating Attachment & Prompt Bar.
- **Color Palette**: Pure Monochrome (`#09090b` obsidian background, `#18181b` zinc cards, `#27272a` subtle borders, `#f4f4f5` text).
- **Typography**: Inter (sans-serif) for natural chat streams, JetBrains Mono for hashes, telemetry, and forensic metadata.

---

### 2. Monochrome Theme CSS Variables (`app/globals.css`)

```css
@layer base {
  :root {
    --background: 240 10% 3.9%;      /* #09090b Obsidian */
    --foreground: 0 0% 98%;          /* #fafafa Off-White */

    --card: 240 5.9% 7%;             /* #121215 Dark Zinc */
    --card-foreground: 0 0% 98%;

    --popover: 240 5.9% 7%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;             /* Crisp White Primary */
    --primary-foreground: 240 5.9% 10%;

    --secondary: 240 3.7% 15.9%;     /* #27272a Subdued Zinc */
    --secondary-foreground: 0 0% 98%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;/* Muted Silver Text */

    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 0% 100%;
    --destructive-foreground: 0 0% 0%;

    --border: 240 3.7% 15.9%;        /* #27272a Crisp Border */
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    --radius: 0.75rem;

    /* Monochrome Severity Signals */
    --badge-authentic-bg: 240 5.9% 12%;
    --badge-authentic-fg: 0 0% 98%;
    --badge-synthetic-bg: 0 0% 98%;
    --badge-synthetic-fg: 240 10% 3.9%;
  }
}
```

---

### 3. Key Components (Gemini Chat Paradigm)

1. **Collapsible Sidebar (Gemini Style)**:
   - Recent Media Analysis threads list.
   - Quick benchmarks (Deepfake Audio, Midjourney Portrait, Authentic Photo, Manipulated ELA).
   - In-app Gemini API Key config dialog trigger.
2. **Conversational Stream & Message Cards**:
   - User messages with attached file pills (image thumbnail, video badge, audio waveform preview).
   - Assistant responses with Gemini AI avatar, natural language reasoning, structured risk score gauge, interactive ELA heatmap, audio spectrogram player, EXIF metadata grid, and "Generate Report" button.
3. **Floating Prompt & Attachment Bar**:
   - Pill-shaped floating search/prompt container at the bottom with attachment button (+ file upload / dropzone), media URL link input, and send button.
4. **Monochrome Forensic Report Certificate Modal**:
   - High-contrast, printable, downloadable PDF / JSON forensic audit report.
