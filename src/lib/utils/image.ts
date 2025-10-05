export function transformPhotoUrl(photoUrl: string | null | undefined): string | null {
  if (!photoUrl) return null;
  
  if (photoUrl.includes('r2.dev')) {
    const filename = photoUrl.split('/').pop();
    return `${process.env.NEXT_PUBLIC_API_URL}/api/uploads/${filename}`;
  }

  return photoUrl;
}