import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { getDocuments, addDocument } from '@/lib/kv';
import { storeFile } from '@/lib/file-storage';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const docs = await getDocuments(holidayId);
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ holidayId: string }> }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 400 });
  }

  const url = await storeFile(file, holidayId);

  const doc = await addDocument(holidayId, {
    id: nanoid(),
    name: file.name,
    url,
    contentType: file.type,
    size: file.size,
    uploadedAt: Date.now(),
  });

  return NextResponse.json(doc, { status: 201 });
}
