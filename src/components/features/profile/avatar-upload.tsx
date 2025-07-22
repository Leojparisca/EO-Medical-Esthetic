
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AvatarUploadProps {
  uid: string
  url: string | null
  onFileSelect: (file: File) => void
}

export function AvatarUpload({ uid, url, onFileSelect }: AvatarUploadProps) {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(url)
  const { toast } = useToast();

  useEffect(() => {
    setAvatarPreviewUrl(url)
  }, [url])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return; // No file selected
      }

      const file = event.target.files[0]
      if (file) {
        setAvatarPreviewUrl(URL.createObjectURL(file)); // Set preview immediately
        onFileSelect(file); // Pass the file to the parent component
      }
      
    } catch (error: any) {
       toast({
        title: 'Error al previsualizar',
        description: error.message,
        variant: 'destructive',
      });
    } 
  }

  return (
    <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary shadow-lg">
            <AvatarImage
                src={avatarPreviewUrl || `https://placehold.co/128x128`}
                alt="Avatar"
                data-ai-hint="woman portrait"
            />
            <AvatarFallback className="text-3xl bg-muted">
                ?
            </AvatarFallback>
        </Avatar>
      <div>
        <Button asChild variant="outline">
          <label htmlFor="single" className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Cambiar Foto
          </label>
        </Button>
        <Input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          name="avatarUrl"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
