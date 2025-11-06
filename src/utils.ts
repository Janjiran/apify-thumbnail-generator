export function getMimeType(format: 'jpg' | 'png'): string {
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    return mimeMap[format] ?? format;
  }