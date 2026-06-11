'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText, FileImage, File, Trash2, Upload, FolderOpen } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useHoliday, useIsOwner } from '@/context/HolidayContext';
import type { HolidayDocument } from '@/types';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function docIcon(contentType: string) {
  if (contentType.startsWith('image/')) return FileImage;
  if (contentType === 'application/pdf') return FileText;
  return File;
}

function docColor(contentType: string): string {
  if (contentType.startsWith('image/')) return '#a855f7';
  if (contentType === 'application/pdf') return '#ff6b6b';
  if (contentType.includes('word') || contentType.includes('document')) return '#3b82f6';
  if (contentType.includes('sheet') || contentType.includes('excel')) return '#22c55e';
  return '#00e5cc';
}

export default function DocumentsPage() {
  const holiday = useHoliday();
  const isOwner = useIsOwner();
  const router = useRouter();
  const [docs, setDocs] = useState<HolidayDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOwner) { router.replace(`/login?from=/holidays/${holiday.id}/documents`); return; }
    fetch(`/api/holidays/${holiday.id}/documents`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setDocs(data); })
      .finally(() => setLoading(false));
  }, [holiday.id, isOwner, router]);

  if (!isOwner) return null;

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`/api/holidays/${holiday.id}/documents`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error ?? 'Upload failed'); return; }
      setDocs(data);
    } catch {
      setUploadError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  }, [holiday.id]);

  async function deleteDoc(id: string) {
    const res = await fetch(`/api/holidays/${holiday.id}/documents/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) setDocs(data);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-5 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <SectionHeading title="Documents" subtitle={`Files attached to ${holiday.name}`} accent="teal" symbol="◈" />
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-8 text-center mb-6"
          style={{
            borderColor: dragOver ? '#00e5cc' : 'rgba(255,255,255,0.12)',
            background: dragOver ? '#00e5cc08' : 'rgba(255,255,255,0.02)',
          }}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={onFileChange} />
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: uploading ? '#00e5cc18' : '#00e5cc12', border: '1px solid #00e5cc33' }}
            >
              {uploading
                ? <div className="w-5 h-5 rounded-full border-2 border-[#00e5cc] border-t-transparent animate-spin" />
                : <Upload className="w-5 h-5 text-[#00e5cc]" />
              }
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {uploading ? 'Uploading…' : dragOver ? 'Drop to upload' : 'Click or drag a file here'}
              </p>
              <p className="text-[#8888aa] text-xs mt-1">Any file type · max 20 MB</p>
            </div>
          </div>
          {uploadError && (
            <p className="mt-3 text-red-400 text-xs flex items-center justify-center gap-1.5">
              <span>⚠</span> {uploadError}
            </p>
          )}
        </div>

        {/* Document list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-[#00e5cc] border-t-transparent animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FolderOpen className="w-10 h-10 text-[#333355] mx-auto" />
            <p className="text-[#555577] text-sm">No documents yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => {
              const Icon = docIcon(doc.contentType);
              const color = docColor(doc.contentType);
              return (
                <div
                  key={doc.id}
                  className="glass rounded-2xl flex items-center gap-4 px-4 py-3.5 group"
                  style={{ border: `1px solid ${color}18` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{doc.name}</p>
                    <p className="text-[#8888aa] text-xs mt-0.5">{formatSize(doc.size)} · {formatDate(doc.uploadedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={doc.name}
                      className="p-2 rounded-lg text-[#8888aa] hover:text-[#00e5cc] transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="p-2 rounded-lg text-[#8888aa] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
