import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function storeFile(
  file: File,
  holidayId: string,
): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
  const filename = `${nanoid()}${ext ? `.${ext}` : ''}`;

  if (USE_BLOB) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`holidays/${holidayId}/${filename}`, file.stream(), {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  }

  // Local dev: write to public/uploads/[holidayId]/
  const dir = path.join(process.cwd(), 'public', 'uploads', holidayId);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${holidayId}/${filename}`;
}

export async function removeFile(url: string): Promise<void> {
  if (USE_BLOB && url.startsWith('http')) {
    const { del } = await import('@vercel/blob');
    await del(url);
    return;
  }
  // Local dev: delete from public/uploads/
  if (url.startsWith('/uploads/')) {
    const filepath = path.join(process.cwd(), 'public', url);
    await fs.unlink(filepath).catch(() => {});
  }
}
