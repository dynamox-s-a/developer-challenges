export async function checkImageUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && Boolean(contentType?.startsWith('image/'));
  } catch {
    return false;
  }
}
