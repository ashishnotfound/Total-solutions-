"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Images, Upload, RefreshCw } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import Gallery from '@/components/Gallery'
import { ImageStorageService, type GalleryImage } from '@/lib/supabase'

export default function GalleryUploadPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload')

  useEffect(() => {
    loadGalleryImages()
  }, [])

  const loadGalleryImages = async () => {
    try {
      setLoading(true)
      const galleryImages = await ImageStorageService.getGalleryImages()
      setImages(galleryImages)
    } catch (error) {
      console.error('Failed to load gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadGalleryImages()
    setRefreshing(false)
  }

  const handleUploadComplete = (newImages: GalleryImage[]) => {
    setImages(prev => [...newImages, ...prev])
    setActiveTab('gallery')
  }

  const handleDeleteImage = async (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Images className="w-8 h-8 text-blue-600" />
                Gallery Manager
              </h1>
              <p className="text-gray-500 mt-1">
                Upload and manage your image gallery
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Images
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'gallery'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4" />
                Gallery ({images.length})
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Images
                </h2>
                <p className="text-gray-600">
                  Drag and drop multiple images or select them from your device
                </p>
              </div>
              
              <ImageUpload 
                onUploadComplete={handleUploadComplete}
                maxFiles={100}
              />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Image Gallery
                    </h2>
                    <p className="text-gray-600">
                      {images.length} {images.length === 1 ? 'image' : 'images'} in your gallery
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Add Images
                  </button>
                </div>
              </div>
              
              <Gallery 
                images={images}
                onDelete={handleDeleteImage}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {images.length}
              </div>
              <div className="text-sm text-gray-500">Total Images</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {(images.reduce((total, img) => total + img.size, 0) / 1024 / 1024).toFixed(1)} MB
              </div>
              <div className="text-sm text-gray-500">Total Storage</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {images.length > 0 ? new Date(Math.max(...images.map(img => new Date(img.created_at).getTime()))).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Last Upload</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
