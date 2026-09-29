'use server';

import { auth } from '@/lib/auth';

/**
 * Server Action — uploads an image (base64 data URL) to Cloudinary when
 * configured, otherwise falls back to returning the base64 payload itself
 * so the demo works with zero external dependencies.
 */
export async function uploadPhoto(base64DataUrl: string): Promise<{ success: boolean; url?: string; storage?: 'cloudinary' | 'local'; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: 'You must be signed in to upload photos.' };
  }

  // Validate it's actually a base64 image payload
  if (!base64DataUrl || !base64DataUrl.startsWith('data:image/')) {
    return { success: false, error: 'Invalid image payload.' };
  }

  const sizeLimit = 5 * 1024 * 1024; // 5MB
  const estimatedBytes = Math.ceil((base64DataUrl.length * 3) / 4);
  if (estimatedBytes > sizeLimit) {
    return { success: false, error: 'Image is too large. Please use an image under 5MB.' };
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  try {
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const folder = 'ecobin';
      const signature = await createCloudinarySignature(folder, timestamp, apiSecret);

      const formData = new FormData();
      formData.append('file', base64DataUrl);
      formData.append('folder', folder);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.secure_url) {
        return { success: true, url: data.secure_url, storage: 'cloudinary' };
      }
      console.error('Cloudinary upload failed:', data);
      return { success: false, error: data?.error?.message || 'Cloudinary upload failed.' };
    }

    // Fallback: store locally as a data URL (kept inside the database string column)
    return { success: true, url: base64DataUrl, storage: 'local' };
  } catch (error: any) {
    console.error('Photo upload error:', error);
    return { success: false, error: error.message || 'Upload failed.' };
  }
}

async function createCloudinarySignature(folder: string, timestamp: number, apiSecret: string): Promise<string> {
  // Cloudinary SHA-1 signature over `folder=..&timestamp=..` + api_secret
  const { createHash } = await import('node:crypto');
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  return createHash('sha1').update(toSign).digest('hex');
}
