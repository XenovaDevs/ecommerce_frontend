/**
 * @ai-context FileUpload component with drag & drop, multiple files, and image preview.
 *             Validates file types/sizes and shows upload progress with gold accents.
 * @ai-props
 *   - onUpload: Async function to handle file upload
 *   - accept: Allowed file types (e.g., "image/*")
 *   - maxSize: Maximum file size in bytes
 *   - maxFiles: Maximum number of files
 *   - multiple: Allow multiple file selection
 *   - preview: Show image previews for image files
 * @ai-flow
 *   1. User drags files or clicks to browse
 *   2. Validates file type and size
 *   3. Shows preview thumbnails for images
 *   4. Calls onUpload with files
 *   5. Shows progress during upload
 *   6. Allows file removal before upload
 * @ai-a11y
 *   - Hidden file input with visible custom trigger
 *   - Keyboard accessible
 *   - ARIA labels for all interactive elements
 */
'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, X, FileIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  preview?: boolean;
  className?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUpload = ({
  onUpload,
  accept = '*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  multiple = true,
  preview = true,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`;
    }

    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileType = file.type;
      const fileExt = `.${file.name.split('.').pop()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(category);
        }
        return type === fileType || type === fileExt;
      });

      if (!isAccepted) {
        return `File type "${fileType}" is not accepted`;
      }
    }

    return null;
  };

  // Handle file selection
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null);
    const fileArray = Array.from(selectedFiles);

    // Check max files
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and add files
    const validFiles: FileWithPreview[] = [];
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create preview for images
      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          (file as FileWithPreview).preview = reader.result as string;
          setFiles((prev) => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(file);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  // Handle drag & drop
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    handleFiles(e.dataTransfer.files);
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revoke object URL if preview exists
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Handle upload
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (replace with actual upload progress)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(files);

      clearInterval(interval);
      setUploadProgress(100);

      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
          'transition-all duration-200',
          isDragging
            ? 'border-gold-500 bg-gold-50'
            : 'border-sage-300 hover:border-sage-400 bg-sage-50/50 hover:bg-sage-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="File upload input"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'transition-colors duration-200',
            isDragging ? 'bg-gold-100' : 'bg-sage-100'
          )}>
            <Upload className={cn(
              'w-6 h-6',
              isDragging ? 'text-gold-600' : 'text-sage-600'
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-sage-900">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-sage-500 mt-1">
              {accept !== '*' ? `${accept} ` : ''}
              {maxSize && `(Max ${formatFileSize(maxSize)})`}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white border border-sage-200 rounded-lg"
            >
              {/* Preview/Icon */}
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : file.type.startsWith('image/') ? (
                  <div className="w-12 h-12 bg-sage-100 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-sage-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-sage-100 rounded flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-sage-500" />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sage-900 truncate">{file.name}</p>
                <p className="text-xs text-sage-500">{formatFileSize(file.size)}</p>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="flex-shrink-0 p-1 text-sage-400 hover:text-red-600 transition-colors disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sage-600 to-gold-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-sage-600 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && !uploading && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={cn(
            'w-full px-4 py-2 rounded-lg font-medium transition-all duration-200',
            'bg-sage-600 text-white hover:bg-sage-700',
            'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </>
          )}
        </button>
      )}
    </div>
  );
};
