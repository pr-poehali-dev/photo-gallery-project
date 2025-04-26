
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AlbumCard from "@/components/PhotoGallery/AlbumCard";
import CreateAlbumCard from "@/components/PhotoGallery/CreateAlbumCard";

interface Album {
  id: string;
  title: string;
  photoCount: number;
  coverUrl?: string;
}

const HomePage = () => {
  const [albums, setAlbums] = useState<Album[]>([
    { id: '1', title: 'Природа', photoCount: 12, coverUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1600' },
    { id: '2', title: 'Путешествия', photoCount: 34, coverUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1600' },
    { id: '3', title: 'Семья', photoCount: 56, coverUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600' },
  ]);
  
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);

  const createAlbum = (title: string) => {
    const newAlbum: Album = {
      id: Date.now().toString(),
      title,
      photoCount: 0
    };
    setAlbums(prev => [...prev, newAlbum]);
  };

  const renameAlbum = (id: string, newTitle: string) => {
    setAlbums(prev => 
      prev.map(album => 
        album.id === id ? { ...album, title: newTitle } : album
      )
    );
  };

  const confirmDeleteAlbum = (id: string) => {
    setAlbumToDelete(id);
  };

  const deleteAlbum = () => {
    if (albumToDelete) {
      setAlbums(prev => prev.filter(album => album.id !== albumToDelete));
      setAlbumToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b dark:bg-background dark:border-border">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">Фотогалерея</h1>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-xl font-semibold mb-6">Мои альбомы</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map(album => (
            <AlbumCard
              key={album.id}
              id={album.id}
              title={album.title}
              photoCount={album.photoCount}
              coverUrl={album.coverUrl}
              onRename={renameAlbum}
              onDelete={confirmDeleteAlbum}
            />
          ))}
          
          <div className="h-full">
            <CreateAlbumCard onCreateAlbum={createAlbum} />
          </div>
        </div>
      </main>

      <AlertDialog open={!!albumToDelete} onOpenChange={(open) => !open && setAlbumToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит альбом и все фотографии в нем. Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAlbum} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomePage;
