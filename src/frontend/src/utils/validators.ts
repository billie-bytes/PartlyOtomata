// Validasi HTML string
export function isValidHtml(html: string): boolean {
  if (!html || html.trim().length === 0) {
    return false;
  }

  // use parser for validation now
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  if (!doc.documentElement || doc.querySelector('parsererror')) {
    return false;
  }

  return /<([a-zA-Z][^\s/>]*)/.test(html);
}

// Validasi URL format
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
