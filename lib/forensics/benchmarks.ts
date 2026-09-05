export interface BenchmarkSample {
  id: string
  title: string
  category: 'Image' | 'Audio' | 'Video'
  description: string
  fileType: string
  previewUrl: string
  syntheticRisk: number // 0 - 100
  verdict: 'Authentic' | 'Suspicious' | 'Synthetic'
  exifData: Record<string, string | number>
  xaiReasoning: {
    summary: string
    keyFindings: string[]
    visualAnomalies: string[]
    audioAnomalies: string[]
    metadataIndicators: string[]
  }
}

export const BENCHMARK_SAMPLES: BenchmarkSample[] = [
  {
    id: 'midjourney-portrait',
    title: 'Midjourney v6 Hyper-Realistic Portrait',
    category: 'Image',
    description: 'Generative AI portrait exhibiting subtle high-frequency iris asymmetry & sub-surface scattering anomalies.',
    fileType: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    syntheticRisk: 92,
    verdict: 'Synthetic',
    exifData: {
      'Camera Make': 'Unknown / Software Generated',
      'Software': 'Midjourney v6.0 Engine',
      'Color Space': 'sRGB',
      'EXIF Metadata Header': 'Missing Hardware Serial / Lens Profile',
      'SynthID Watermark': 'Detected (Frequency-domain watermark)',
      'Dimensions': '1024 x 1024'
    },
    xaiReasoning: {
      summary: 'High confidence generative AI image synthesis detected with 92% probability.',
      keyFindings: [
        'Iris specular reflections show dual mismatched light vectors.',
        'Hair strands merge into continuous skin texture mesh near the left temple.',
        'Complete absence of camera sensor Bayer pattern noise.'
      ],
      visualAnomalies: [
        'Unnatural skin smoothness differential between neck and facial cheek.',
        'Ear anatomy curvature shows top-layer diffusion artifacting.'
      ],
      audioAnomalies: ['N/A - Image File'],
      metadataIndicators: [
        'C2PA Manifest signature missing.',
        'Software tag indicates Midjourney v6 generation pipeline.'
      ]
    }
  },
  {
    id: 'spliced-field-photo',
    title: 'Manipulated Field Photo (ELA Splicing)',
    category: 'Image',
    description: 'Authentic journalism photo with a spliced object injected in the background via image editing.',
    fileType: 'image/png',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    syntheticRisk: 58,
    verdict: 'Suspicious',
    exifData: {
      'Camera Make': 'Canon EOS R5',
      'Lens': 'RF 50mm f/1.2L USM',
      'ISO': 400,
      'Software': 'Adobe Photoshop 25.1 (Macintosh)',
      'Modification Date': '2026-08-14T14:22:01Z'
    },
    xaiReasoning: {
      summary: 'Inconclusive / Altered Authentic Media. Photo is original but contains spliced elements.',
      keyFindings: [
        'Error Level Analysis (ELA) highlights high compression contrast in upper right quadrant.',
        'EXIF history confirms re-saving in Adobe Photoshop.'
      ],
      visualAnomalies: [
        'Shadow direction on secondary subject mismatches primary light source by 34 degrees.'
      ],
      audioAnomalies: ['N/A - Image File'],
      metadataIndicators: [
        'EXIF header preserved from Canon EOS R5, but edit software footprint present.'
      ]
    }
  },
  {
    id: 'deepfake-video-audit',
    title: 'Political Speech Deepfake Video',
    category: 'Video',
    description: 'Manipulated speech video with AI voice clone & neural lip-sync facial replacement.',
    fileType: 'video/mp4',
    previewUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    syntheticRisk: 88,
    verdict: 'Synthetic',
    exifData: {
      'Video Codec': 'H.264 / AVC',
      'Frame Rate': '29.97 fps',
      'Audio Stream': 'AAC 44.1kHz Synthetic Vocoder',
      'Lip-Sync Offset': '+140ms inconsistent boundary',
      'Temporal Motion Vector': 'Facial boundary jitter detected'
    },
    xaiReasoning: {
      summary: 'High confidence video deepfake with synthetic audio overlay and facial swap.',
      keyFindings: [
        'Facial boundary flickering detected across keyframes 120-340.',
        'Audio-visual lip sync phoneme mismatch score exceeds safety threshold (88%).'
      ],
      visualAnomalies: [
        'Unnatural eye blinking rate (0.2 blinks/min vs normal 15-20 blinks/min).',
        'Jawline skin boundary blurring during rapid head movement.'
      ],
      audioAnomalies: [
        'Neural vocoder high-frequency cutoff at 14kHz.',
        'Absence of natural breathing pauses between long sentences.'
      ],
      metadataIndicators: [
        'Video container lacks camera sensor hash.',
        'Audio track contains phase discontinuity artifacts.'
      ]
    }
  },
  {
    id: 'authentic-journalism-photo',
    title: 'Verified Reuters News Photo',
    category: 'Image',
    description: 'Raw unedited press photo with cryptographically verified C2PA provenance header.',
    fileType: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
    syntheticRisk: 8,
    verdict: 'Authentic',
    exifData: {
      'Camera Make': 'Nikon Z9',
      'Lens': 'NIKKOR Z 70-200mm f/2.8 VR S',
      'ISO': 800,
      'C2PA Provenance': 'Verified Signature (Reuters Content Credentials)',
      'GPS Location': '38.8977° N, 77.0365° W',
      'SHA-256': 'a8f7c9e120b411d38e762a1f89bc0192e44d'
    },
    xaiReasoning: {
      summary: 'High confidence authentic photograph verified via C2PA digital provenance.',
      keyFindings: [
        'Uniform noise distribution across all frequency bands.',
        'C2PA cryptographic signature verified against trusted newsroom authority.'
      ],
      visualAnomalies: ['None detected.'],
      audioAnomalies: ['N/A - Image File'],
      metadataIndicators: [
        'Authentic hardware EXIF metadata with full lens/sensor calibration data.'
      ]
    }
  },
  {
    id: 'cloned-voice-speech',
    title: 'ElevenLabs AI Voice Clone Audio',
    category: 'Audio',
    description: 'Cloned audio recording replicating a CEO announcement for financial fraud simulation.',
    fileType: 'audio/mp3',
    previewUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    syntheticRisk: 95,
    verdict: 'Synthetic',
    exifData: {
      'Audio Format': 'MP3 320kbps',
      'Sample Rate': '44100 Hz',
      'Pitch Variance': 'Static pitch envelope (Synthetic)',
      'Spectral Energy Falloff': 'Step-function drop at 16kHz',
      'Vocoder Profile': 'FastSpeech2 / HiFi-GAN architecture'
    },
    xaiReasoning: {
      summary: '95% Synthetic Audio. Voice clone generated via neural audio synthesis.',
      keyFindings: [
        'Pitch contour exhibits artificial micro-vibrato unnaturally locked at 120Hz.',
        'Spectral energy spectrogram shows sharp robotic cutoffs.'
      ],
      visualAnomalies: ['N/A - Audio File'],
      audioAnomalies: [
        'Zero ambient background noise room impulse response.',
        'Unnatural robotic formant transitions between vowels.'
      ],
      metadataIndicators: [
        'Audio stream generated via synthetic vocoder without micro-acoustic variation.'
      ]
    }
  }
]
