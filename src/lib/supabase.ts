import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export interface GalleryImage {
  id: string
  url: string
  name: string
  size: number
  created_at: string
}

export class ImageStorageService {
  private static BUCKET_NAME = 'gallery'

  static async uploadImages(
    files: File[],
    onProgress?: (progress: UploadProgress[]) => void
  ): Promise<GalleryImage[]> {
    const uploadProgress: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }))

    const uploadedImages: GalleryImage[] = []

    try {
      // Upload files using server API for better reliability
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Update status to uploading
          uploadProgress[index] = {
            ...uploadProgress[index],
            status: 'uploading',
            progress: 50
          }
          onProgress?.([...uploadProgress])

          // Upload using server API
          const formData = new FormData()
          formData.append('file', file)
          formData.append('bucket', 'gallery')

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Upload failed')
          }

          const data = await response.json()

          // Update progress to success
          uploadProgress[index] = {
            ...uploadProgress[index],
            status: 'success',
            progress: 100,
            url: data.url
          }
          onProgress?.([...uploadProgress])

          const galleryImage: GalleryImage = {
            id: data.path || file.name,
            url: data.url,
            name: file.name,
            size: file.size,
            created_at: new Date().toISOString()
          }

          uploadedImages.push(galleryImage)
          return galleryImage

        } catch (error) {
          // Update progress to error
          uploadProgress[index] = {
            ...uploadProgress[index],
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          }
          onProgress?.([...uploadProgress])
          throw error
        }
      })

      await Promise.all(uploadPromises)
      return uploadedImages

    } catch (error) {
      console.error('Bulk upload failed:', error)
      throw error
    }
  }

  static async deleteImage(imagePath: string): Promise<void> {
    try {
      // Use server API for deletion
      const response = await fetch('/api/admin/delete-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: imagePath, bucket: 'gallery' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      throw error
    }
  }

  static async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      // Use server API to list files
      const response = await fetch('/api/admin/list-files?bucket=gallery')
      
      if (!response.ok) {
        console.error('Failed to list gallery files')
        return []
      }

      const data = await response.json()
      
      if (!data.files) {
        return []
      }

      const images: GalleryImage[] = data.files
        .filter((item: any) => !item.id.endsWith('/'))
        .map((item: any) => {
          const publicUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '')}.storage.supabase.co/storage/v1/object/public/gallery/${item.name}`

          return {
            id: item.id,
            url: publicUrl,
            name: item.name,
            size: item.metadata?.size || 0,
            created_at: item.created_at || new Date().toISOString()
          }
        })

      return images
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
      return []
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPG, PNG, or WebP images.'
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File too large. Maximum size is 10MB.'
      }
    }

    return { valid: true }
  }
}
