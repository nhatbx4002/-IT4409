import { useState, useCallback } from 'react';
import { adminApiClient, createFormDataRequest } from '@/lib/api';

interface FileUploadOptions {
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
}

interface FileUploadState {
  files: File[];
  previews: string[];
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrls: string[];
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxFiles = 10,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    previews: [],
    uploading: false,
    progress: 0,
    error: null,
    uploadedUrls: []
  });

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`;
    }
    return null;
  }, [acceptedTypes, maxFileSize]);

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setState(prev => ({
        ...prev,
        error: errors.join('; ')
      }));
      return;
    }

    if (state.files.length + validFiles.length > maxFiles) {
      setState(prev => ({
        ...prev,
        error: `Cannot add more than ${maxFiles} files`
      }));
      return;
    }

    const previews = validFiles.map(file => URL.createObjectURL(file));

    setState(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles],
      previews: [...prev.previews, ...previews],
      error: null
    }));
  }, [state.files.length, maxFiles, validateFile]);

  const removeFile = useCallback((index: number) => {
    setState(prev => {
      const newFiles = [...prev.files];
      const newPreviews = [...prev.previews];

      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);

      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prev,
        files: newFiles,
        previews: newPreviews
      };
    });
  }, []);

  const clearFiles = useCallback(() => {
    state.previews.forEach(preview => URL.revokeObjectURL(preview));
    setState({
      files: [],
      previews: [],
      uploading: false,
      progress: 0,
      error: null,
      uploadedUrls: []
    });
  }, [state.previews]);

  const uploadFiles = useCallback(async (endpoint: string = '/products/upload') => {
    if (state.files.length === 0) {
      setState(prev => ({ ...prev, error: 'No files to upload' }));
      return [];
    }

    setState(prev => ({ ...prev, uploading: true, error: null, progress: 0 }));
    onUploadStart?.();

    try {
      const formData = new FormData();
      state.files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const res = await adminApiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setState(prev => ({ ...prev, progress }));
            onUploadProgress?.(progress);
          }
        }
      });

      const uploadedUrls = res.data.urls || res.data || [];

      setState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        uploadedUrls
      }));

      onUploadComplete?.(uploadedUrls);
      return uploadedUrls;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      setState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }));
      onUploadError?.(errorMessage);
      throw error;
    }
  }, [state.files, onUploadStart, onUploadProgress, onUploadComplete, onUploadError]);

  return {
    ...state,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles
  };
}