/**
 * Error Level Analysis (ELA) Engine
 * Performs JPEG compression differential analysis on HTML5 Canvas
 * to detect spliced or modified image segments.
 */

export interface ELAAnalysisResult {
  elaDataUrl: string
  anomalyScore: number // 0-100
  compressionDifferential: string
  hotspotCount: number
}

export async function processCanvasELA(
  imageSource: string | File,
  quality = 0.7
): Promise<ELAAnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width || 600
        const height = img.naturalHeight || img.height || 400

        // Create main canvas
        const mainCanvas = document.createElement('canvas')
        mainCanvas.width = width
        mainCanvas.height = height
        const mainCtx = mainCanvas.getContext('2d')
        if (!mainCtx) {
          reject(new Error('Canvas context unavailable'))
          return
        }

        mainCtx.drawImage(img, 0, 0, width, height)
        const originalData = mainCtx.getImageData(0, 0, width, height)

        // Compress image at specified quality
        const resavedDataUrl = mainCanvas.toDataURL('image/jpeg', quality)

        const compressedImg = new Image()
        compressedImg.onload = () => {
          const compCanvas = document.createElement('canvas')
          compCanvas.width = width
          compCanvas.height = height
          const compCtx = compCanvas.getContext('2d')
          if (!compCtx) {
            reject(new Error('Compressed context unavailable'))
            return
          }

          compCtx.drawImage(compressedImg, 0, 0, width, height)
          const compressedData = compCtx.getImageData(0, 0, width, height)

          // Create ELA Difference Canvas
          const elaCanvas = document.createElement('canvas')
          elaCanvas.width = width
          elaCanvas.height = height
          const elaCtx = elaCanvas.getContext('2d')
          if (!elaCtx) {
            reject(new Error('ELA context unavailable'))
            return
          }

          const elaData = elaCtx.createImageData(width, height)
          const scaleFactor = 15 // Amplify error differences for visual contrast

          let maxDiff = 0
          let totalDiff = 0
          let hotspots = 0

          for (let i = 0; i < originalData.data.length; i += 4) {
            const rDiff = Math.abs(originalData.data[i] - compressedData.data[i]) * scaleFactor
            const gDiff = Math.abs(originalData.data[i + 1] - compressedData.data[i + 1]) * scaleFactor
            const bDiff = Math.abs(originalData.data[i + 2] - compressedData.data[i + 2]) * scaleFactor

            const pixelDiff = (rDiff + gDiff + bDiff) / 3
            if (pixelDiff > 120) hotspots++
            if (pixelDiff > maxDiff) maxDiff = pixelDiff
            totalDiff += pixelDiff

            // Render high contrast monochrome highlight map
            elaData.data[i] = Math.min(255, rDiff)     // Red / Mono highlight
            elaData.data[i + 1] = Math.min(255, gDiff) // Green highlight
            elaData.data[i + 2] = Math.min(255, bDiff) // Blue highlight
            elaData.data[i + 3] = 255                  // Alpha
          }

          elaCtx.putImageData(elaData, 0, 0)

          const avgDiff = totalDiff / (width * height)
          const anomalyScore = Math.min(99, Math.round((hotspots / (width * height / 100)) * 12 + avgDiff * 2))

          resolve({
            elaDataUrl: elaCanvas.toDataURL('image/png'),
            anomalyScore,
            compressionDifferential: `${(quality * 100).toFixed(0)}% JPEG Resave Delta`,
            hotspotCount: hotspots
          })
        }

        compressedImg.src = resavedDataUrl
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = (err) => reject(err)

    if (typeof imageSource === 'string') {
      img.src = imageSource
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string
        }
      }
      reader.readAsDataURL(imageSource)
    }
  })
}
