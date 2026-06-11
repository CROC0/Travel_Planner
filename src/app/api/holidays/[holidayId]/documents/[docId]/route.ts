import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { getHoliday, ownedByUser } from '@/lib/holidays';
import { getDocuments, deleteDocument } from '@/lib/kv';
import { removeFile } from '@/lib/file-storage';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ holidayId: string; docId: string }> },
) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { holidayId, docId } = await params;
  const holiday = await getHoliday(holidayId);
  if (!holiday || !ownedByUser(holiday, user.userId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const docs = await getDocuments(holidayId);
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  await removeFile(doc.url);
  const next = await deleteDocument(holidayId, docId);
  return NextResponse.json(next);
}
