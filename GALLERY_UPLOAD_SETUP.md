# Bulk Image Upload System - Setup Guide

A modern, Instagram-like bulk image upload system with Supabase Storage integration, featuring drag-and-drop upload, responsive gallery grid, and full image management capabilities.

## 🚀 Features

- **Bulk Upload**: Select 50-100 images at once
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Progress Tracking**: Real-time upload progress for each file
- **Gallery UI**: Instagram-style responsive grid layout
- **Image Preview**: Full-screen modal preview
- **Delete Management**: Remove unwanted images
- **Lazy Loading**: Optimized performance
- **Error Handling**: Comprehensive error management
- **File Validation**: Type and size restrictions

## 📦 Dependencies

Install the required packages:

```bash
npm install @supabase/supabase-js framer-motion lucide-react
```

## ⚙️ Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and Anon Key to `.env.local`

### 2. Create Storage Bucket

```sql
-- Run this in your Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);
```

### 3. Set Up Storage Policies

```sql
-- Allow public access to gallery bucket
CREATE POLICY "Public Access" ON storage.objects
FOR ALL USING (bucket_id = 'gallery');

-- Allow authenticated users to upload
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery');

-- Allow users to manage their own images
CREATE POLICY "Users can manage their images" ON storage.objects
FOR ALL USING (bucket_id = 'gallery');
```

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client and storage service
├── components/
│   ├── ImageUpload.tsx          # Drag-and-drop upload component
│   └── Gallery.tsx              # Gallery grid with modal preview
└── app/
    └── gallery-upload/
        └── page.tsx             # Main gallery upload page
```

## 🎯 Usage

### Access the Gallery Manager

Navigate to `/gallery-upload` in your application.

### Upload Images

1. **Drag & Drop**: Drag multiple images onto the upload area
2. **File Picker**: Click "Choose Files" to select from your device
3. **Supported Formats**: JPG, PNG, WebP
4. **File Size**: Maximum 10MB per file
5. **Maximum Files**: 100 files per batch

### Gallery Management

- **View Images**: Click any image to open full-screen preview
- **Download**: Download images to your device
- **Delete**: Remove unwanted images (with confirmation)
- **Responsive**: Works on desktop, tablet, and mobile

## 🎨 Customization

### Change Bucket Name

Update the bucket name in `src/lib/supabase.ts`:

```typescript
private static BUCKET_NAME = 'your-custom-bucket'
```

### Modify File Restrictions

Update validation in `src/lib/supabase.ts`:

```typescript
static validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB - change this value
  
  // ... validation logic
}
```

### Customize Gallery Grid

Modify grid columns in `src/components/Gallery.tsx`:

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Change grid-cols-* values to adjust columns */}
</div>
```

## 🔧 Advanced Configuration

### Custom Image Transformation

Add image processing with Supabase Edge Functions:

```typescript
// Example: Auto-generate thumbnails
const { data } = await supabase.storage
  .from('gallery')
  .createSignedUrl(fileName, 3600, {
    transform: {
      width: 300,
      height: 300,
      quality: 80
    }
  })
```

### Add Image Metadata

Store additional image information:

```typescript
// In ImageStorageService.uploadImages
const metadata = {
  originalName: file.name,
  uploadedBy: userId,
  tags: ['gallery', 'image'],
  description: 'Optional description'
}

const { data } = await supabase.storage
  .from(this.BUCKET_NAME)
  .upload(fileName, file, {
    metadata,
    cacheControl: '3600',
    upsert: false
  })
```

## 🚀 Performance Optimizations

### Lazy Loading

Images use Next.js `Image` component with lazy loading by default.

### Image Optimization

Add next.config.js for image optimization:

```javascript
module.exports = {
  images: {
    domains: ['your-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### Caching

Images are cached for 1 hour by default. Adjust cache control:

```typescript
cacheControl: '7200' // 2 hours
```

## 🐛 Troubleshooting

### Common Issues

1. **Upload Fails**: Check Supabase URL and keys in `.env.local`
2. **403 Errors**: Verify storage policies are set correctly
3. **Large Images**: Reduce file size limits or implement compression
4. **Slow Loading**: Enable CDN in Supabase settings

### Debug Mode

Add debug logging:

```typescript
// In supabase.ts
console.log('Upload progress:', progress)
console.log('Storage response:', data)
```

## 🔒 Security Considerations

1. **File Types**: Only allow image file types
2. **File Size**: Implement reasonable size limits
3. **Access Control**: Use Supabase Auth for user management
4. **Rate Limiting**: Consider implementing upload rate limits

## 📱 Mobile Support

The system is fully responsive and works on:

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS Safari, Android Chrome)

## 🎯 Next Steps

- Add image tagging and search
- Implement image albums/folders
- Add image editing capabilities
- Create user-specific galleries
- Add sharing functionality

---

**Built with**: Next.js, Supabase, Framer Motion, Tailwind CSS

**Support**: For issues, check the console logs and verify your Supabase configuration.
