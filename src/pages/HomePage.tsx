
import { useState, useEffect } from 'react';
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
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  
  // При первой загрузке инициализируем локальное хранилище если оно пустое
  useEffect(() => {
    const storedAlbums = localStorage.getItem('photoAlbums');
    if (storedAlbums) {
      setAlbums(JSON.parse(storedAlbums));
    } else {
      // Начальное состояние - пустой массив
      localStorage.setItem('photoAlbums', JSON.stringify([]));
    }
  }, []);

  // Сохраняем альбомы в localStorage при любом изменении
  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem('photoAlbums', JSON.stringify(albums));
    }
  }, [albums]);

  const createAlbum = (title: string) => {
    const newAlbum: Album = {
      id: Date.now().toString(),
      title,
      photoCount: 0
    };
    const updatedAlbums = [...albums, newAlbum];
    setAlbums(updatedAlbums);
    localStorage.setItem('photoAlbums', JSON.stringify(updatedAlbums));
  };

  const renameAlbum = (id: string, newTitle: string) => {
    const updatedAlbums = albums.map(album => 
      album.id === id ? { ...album, title: newTitle } : album
    );
    setAlbums(updatedAlbums);
    localStorage.setItem('photoAlbums', JSON.stringify(updatedAlbums));
  };

  const confirmDeleteAlbum = (id: string) => {
    setAlbumToDelete(id);
  };

  const deleteAlbum = () => {
    if (albumToDelete) {
      const updatedAlbums = albums.filter(album => album.id !== albumToDelete);
      setAlbums(updatedAlbums);
      localStorage.setItem('photoAlbums', JSON.stringify(updatedAlbums));
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
