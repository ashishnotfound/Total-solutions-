"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Download, ZoomIn, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ImageStorageService, type GalleryImage } from '@/lib/supabase'

interface GalleryProps {
  images: GalleryImage[]
  onDelete?: (imageId: string) => void
  loading?: boolean
  className?: string
}

export default function Gallery({ 
  images, 
  onDelete, 
  loading = false,
  className = '' 
}: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (image: GalleryImage) => {
    if (!onDelete) return

    setDeletingId(image.id)
    try {
      // Extract file path from URL
      const imagePath = image.url.split('/').pop() || image.name
      await ImageStorageService.deleteImage(imagePath)
      onDelete(image.id)
    } catch (error) {
      console.error('Failed to delete image:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = image.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={`w-full text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ZoomIn className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
        <p className="text-sm text-gray-500">Upload some images to see them here</p>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImage(image)
                    }}
                    className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-900" />
                  </button>
                  
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(image)
                      }}
                      disabled={deletingId === image.id}
                      className="w-10 h-10 bg-red-500/90 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50"
                    >
                      {deletingId === image.id ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  fill
                  className="object-contain"
                  loading="eager"
                />
              </div>

              {/* Image Info & Actions */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="font-medium truncate">{selectedImage.name}</p>
                    <p className="text-sm opacity-75">
                      {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(selectedImage)}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(selectedImage)}
                        disabled={deletingId === selectedImage.id}
                        className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50"
                      >
                        {deletingId === selectedImage.id ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
