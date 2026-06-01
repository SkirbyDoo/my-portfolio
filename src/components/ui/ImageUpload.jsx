import { useState, useRef } from 'react'
import { Upload, X, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    // Demo mode: use a local object URL instead of uploading
    if (!supabase) {
      const url = URL.createObjectURL(file)
      onChange(url)
      toast.success('Image set! (Demo mode — not saved to cloud)')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}.${ext}`

    if (value) {
      const oldPath = value.split('/site-images/')[1]
      if (oldPath) await supabase.storage.from('site-images').remove([oldPath])
    }

    const { error } = await supabase.storage.from('site-images').upload(filename, file, { upsert: true })

    if (error) {
      toast.error('Upload failed. Please try again.')
    } else {
      const { data } = supabase.storage.from('site-images').getPublicUrl(filename)
      onChange(data.publicUrl)
      toast.success('Image uploaded!')
    }
    setUploading(false)
  }

  const handleRemove = async () => {
    if (supabase && value) {
      const oldPath = value.split('/site-images/')[1]
      if (oldPath) await supabase.storage.from('site-images').remove([oldPath])
    }
    onChange('')
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => { e.target.src = 'https://placehold.co/192x128?text=Image' }}
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={12} />
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-500"
        >
          {uploading ? (
            <Loader size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-xs mt-1">{label}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
