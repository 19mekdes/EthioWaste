'use client';

import React, { useRef, useState } from 'react';
import { Camera, Loader2, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadPhoto } from '@/actions/uploads';

interface ImagePreset {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  presets?: ImagePreset[];
  previewHeight?: string;
  accentColor?: 'emerald' | 'sky';
}

const ACCENT_STYLES = {
  emerald: {
    labelIcon: 'text-emerald-400',
    dropActive: 'border-emerald-400 bg-emerald-500/10',
    presetActive: 'bg-emerald-500/20 border-emerald-500 text-emerald-300',
    spinner: 'text-emerald-400',
  },
  sky: {
    labelIcon: 'text-sky-400',
    dropActive: 'border-sky-400 bg-sky-500/10',
    presetActive: 'bg-sky-500/20 border-sky-500 text-sky-300',
    spinner: 'text-sky-400',
  },
} as const;

/**
 * Reusable photo upload field.
 * - Drag & drop / click-to-upload → base64 → Cloudinary server action
 *   (gracefully falls back to local storage when Cloudinary isn't configured)
 * - Optional URL input + sample presets
 * - Live preview
 */
export function ImageUploadField({
  label = 'Photo',
  value,
  onChange,
  presets = [],
  previewHeight = 'h-44',
  accentColor = 'emerald',
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const styles = ACCENT_STYLES[accentColor];

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WebP...)');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await uploadPhoto(base64);
        if (res.success && res.url) {
          onChange(res.url);
        } else {
          setUploadError(res.error || 'Upload failed. Try a preset or URL instead.');
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Could not read the selected file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload failed.');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <span className={`block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5`}>
          <Camera className={`w-3.5 h-3.5 ${styles.labelIcon}`} />
          {label}
        </span>
      )}

      {/* Dropzone / Upload Button */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver ? styles.dropActive : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
        {uploading ? (
          <div className={`flex items-center justify-center gap-2 text-xs ${styles.spinner} py-2`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading to Cloudinary...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
            <Upload className="w-4 h-4" />
            <span className="font-semibold text-slate-300">Click or drop an image</span>
            <span className="hidden sm:inline text-slate-500">· max 5MB</span>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 text-[11px] text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {uploadError}
        </div>
      )}

      {/* URL input */}
      <div className="relative">
        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="...or paste an image URL"
          className="w-full glass-input pl-9 text-xs"
        />
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">Sample photos:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(p.url)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                value === p.url
                  ? styles.presetActive
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className={`relative w-full ${previewHeight} rounded-xl overflow-hidden border border-slate-800 mt-2`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Photo Attached ✓
          </div>
        </div>
      )}
    </div>
  );
}
