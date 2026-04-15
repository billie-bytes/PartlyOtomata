// Validasi HTML string
export function isValidHtml(html: string): boolean {
  if (!html || html.trim().length === 0) {
    return false;
  }
  
  // Check open/close tags balance (simple)
  const openTags = (html.match(/<[^/][^>]*>/g) || []).length;
  const closeTags = (html.match(/<\/[^>]*>/g) || []).length;
  
  return openTags === closeTags;
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
