
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronLeft, 
  Upload, 
  Image as ImageIcon 
} from "lucide-react";
import PhotoViewer from "@/components/PhotoGallery/PhotoViewer";
import PhotoUploader from "@/components/PhotoGallery/PhotoUploader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Photo {
  id: string;
  url: string;
  title: string;
  albumId: string;
  width: number;
  height: number;
}

interface Album {
  id: string;
  title: string;
  photoCount: number;
  coverUrl?: string;
}

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [albumTitle, setAlbumTitle] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState(200);
  const [gap, setGap] = useState(8);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('masonry');

  // Загрузка данных альбома
  useEffect(() => {
    if (!albumId) return;
    
    // Загрузка данных альбома из localStorage
    const storedAlbums = localStorage.getItem('photoAlbums');
    if (storedAlbums) {
      const albums: Album[] = JSON.parse(storedAlbums);
      const album = albums.find(a => a.id === albumId);
      
      if (album) {
        setAlbumTitle(album.title);
      } else {
        // Если альбом не найден, перенаправляем на главную
        navigate('/');
        return;
      }
    }
    
    // Загрузка фотографий альбома
    const storedPhotos = localStorage.getItem(`albumPhotos_${albumId}`);
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    } else {
      localStorage.setItem(`albumPhotos_${albumId}`, JSON.stringify([]));
    }
  }, [albumId, navigate]);

  // Сохранение фотографий при изменении
  useEffect(() => {
    if (albumId && photos.length >= 0) {
      localStorage.setItem(`albumPhotos_${albumId}`, JSON.stringify(photos));
      
      // Обновление количества фото и обложки в альбоме
      const storedAlbums = localStorage.getItem('photoAlbums');
      if (storedAlbums) {
        const albums: Album[] = JSON.parse(storedAlbums);
        const updatedAlbums = albums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              photoCount: photos.length,
              coverUrl: photos.length > 0 ? photos[0].url : undefined
            };
          }
          return album;
        });
        localStorage.setItem('photoAlbums', JSON.stringify(updatedAlbums));
      }
    }
  }, [photos, albumId]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setUploaderOpen(true);
    }
  };

  const handleFileUpload = (files: File[], titles: string[]) => {
    setIsUploading(true);
    
    // Создаем массив для хранения новых фото
    const newPhotos: Photo[] = [];
    let loadedCount = 0;
    
    // Для каждого файла создаем изображение и получаем его размеры
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const photo: Photo = {
            id: Date.now() + index.toString(),
            url: img.src,
            title: titles[index] || file.name,
            albumId: albumId || '',
            width: img.width,
            height: img.height
          };
          
          newPhotos.push(photo);
          loadedCount++;
          
          // Когда все фото загружены
          if (loadedCount === files.length) {
            setPhotos(prev => [...prev, ...newPhotos]);
            setIsUploading(false);
            setUploaderOpen(false);
            setSelectedFiles([]);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const openPhotoViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  const deletePhoto = () => {
    if (photoToDelete) {
      setPhotos(prev => prev.filter(photo => photo.id !== photoToDelete));
      setPhotoToDelete(null);
    }
  };

  const movePhoto = (photoId: string) => {
    // В реальном приложении здесь был бы код для перемещения фото
    console.log('Moving photo', photoId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b dark:bg-background dark:border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="outline" size="icon">
                  <ChevronLeft size={18} />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{albumTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} className="mr-2" />
                Загрузить фото
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container py-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Режим отображения:</span>
              <Select value={layoutMode} onValueChange={(value) => setLayoutMode(value as 'grid' | 'masonry')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Сетка</SelectItem>
                  <SelectItem value="masonry">Коллаж</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium min-w-24">Размер превью:</span>
              <Slider 
                className="w-48" 
                value={[previewSize]} 
                min={100} 
                max={300} 
                step={10}
                onValueChange={(value) => setPreviewSize(value[0])} 
              />
              <span className="text-sm">{previewSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium min-w-24">Отступ между фото:</span>
              <Slider 
                className="w-48" 
                value={[gap]} 
                min={0} 
                max={24} 
                step={2}
                onValueChange={(value) => setGap(value[0])} 
              />
              <span className="text-sm">{gap}px</span>
            </div>
          </div>
          
          {photos.length > 0 ? (
            <div 
              className={layoutMode === 'grid'
                ? `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`
                : `columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6`
              }
              style={{ columnGap: `${gap}px` }}
            >
              {photos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`group relative ${layoutMode === 'grid' ? '' : 'break-inside-avoid'}`}
                  style={{ 
                    margin: layoutMode === 'grid' ? `${gap/2}px` : `0 0 ${gap}px 0`,
                    width: layoutMode === 'grid' ? `${previewSize}px` : 'auto',
                    height: layoutMode === 'grid' ? `${previewSize}px` : 'auto',
                    display: layoutMode === 'grid' ? 'inline-block' : 'block'
                  }}
                  onClick={() => openPhotoViewer(index)}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className={`w-full h-full object-cover cursor-pointer transition-transform hover:scale-105`}
                      style={{ 
                        width: '100%',
                        height: layoutMode === 'grid' ? '100%' : 'auto'
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-white p-2 text-sm text-shadow">
                      {photo.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ImageIcon size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Альбом пуст</h3>
              <p className="text-muted-foreground mb-4">Загрузите фотографии, чтобы наполнить этот альбом</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} className="mr-2" />
                Загрузить фото
              </Button>
            </div>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <PhotoViewer 
          photos={photos}
          currentIndex={currentPhotoIndex}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          onDelete={(photoId) => setPhotoToDelete(photoId)}
          onMove={movePhoto}
        />
      )}

      <PhotoUploader 
        files={selectedFiles}
        open={uploaderOpen}
        onOpenChange={setUploaderOpen}
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />

      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить фотографию?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту фотографию? Это действие нельзя будет отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deletePhoto} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlbumPage;
