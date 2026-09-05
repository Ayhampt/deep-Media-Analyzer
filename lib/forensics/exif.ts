import exifr from 'exifr'

export interface ParsedMetadata {
  make?: string
  model?: string
  software?: string
  createDate?: string
  modifyDate?: string
  exposureTime?: string
  fNumber?: number
  iso?: number
  gps?: { latitude?: number; longitude?: number }
  allTags: Record<string, string | number | boolean>
}

export async function parseMediaMetadata(file: File | string): Promise<ParsedMetadata> {
  try {
    const rawData = await exifr.parse(file, true) || {}

    return {
      make: rawData.Make || rawData.make || 'Unknown',
      model: rawData.Model || rawData.model || 'N/A',
      software: rawData.Software || rawData.software || 'Software Signature Unspecified',
      createDate: rawData.CreateDate ? new Date(rawData.CreateDate).toISOString() : 'N/A',
      modifyDate: rawData.ModifyDate ? new Date(rawData.ModifyDate).toISOString() : 'N/A',
      exposureTime: rawData.ExposureTime ? `1/${Math.round(1 / rawData.ExposureTime)}s` : 'N/A',
      fNumber: rawData.FNumber || rawData.fNumber,
      iso: rawData.ISO || rawData.iso,
      gps: rawData.latitude && rawData.longitude ? { latitude: rawData.latitude, longitude: rawData.longitude } : undefined,
      allTags: rawData
    }
  } catch {
    return {
      make: 'Hardware EXIF Stripped / Generative Pipeline',
      model: 'N/A',
      software: 'Web Ingestion Parser',
      createDate: new Date().toISOString(),
      modifyDate: new Date().toISOString(),
      allTags: {}
    }
  }
}
