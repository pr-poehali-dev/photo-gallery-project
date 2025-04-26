
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Trash2, FolderSymlink } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  albumId: string;
}

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (photoId: string) => void;
  onMove: (photoId: string) => void;
}

const PhotoViewer = ({ photos, currentIndex, open, onOpenChange, onDelete, onMove }: PhotoViewerProps) => {
  const [index, setIndex] = useState(currentIndex);
  
  const navigateToNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const navigateToPrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const currentPhoto = photos[index];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden bg-black/95 text-white">
        <div className="relative flex flex-col h-full">
          {/* Top bar */}
          <div className="flex justify-between items-center p-4 bg-black/50">
            <h3 className="text-lg font-medium">{currentPhoto?.title}</h3>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="text-white" />
            </Button>
          </div>
          
          {/* Photo display */}
          <div className="flex-1 overflow-hidden flex items-center justify-center relative">
            {photos.length > 0 && (
              <img 
                src={currentPhoto?.url} 
                alt={currentPhoto?.title}
                className="max-h-full max-w-full object-contain"
              />
            )}
            
            {/* Navigation buttons */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 rounded-full bg-black/30 hover:bg-black/50"
              onClick={navigateToPrevious}
            >
              <ChevronLeft size={24} className="text-white" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 rounded-full bg-black/30 hover:bg-black/50"
              onClick={navigateToNext}
            >
              <ChevronRight size={24} className="text-white" />
            </Button>
          </div>
          
          {/* Bottom bar */}
          <div className="flex justify-end items-center p-4 bg-black/50">
            <Button 
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => onMove(currentPhoto?.id)}
            >
              <FolderSymlink size={16} />
              <span>Переместить</span>
            </Button>
            <Button 
              variant="ghost"
              className="text-destructive hover:bg-destructive/20"
              onClick={() => onDelete(currentPhoto?.id)}
            >
              <Trash2 size={16} />
              <span>Удалить</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewer;
