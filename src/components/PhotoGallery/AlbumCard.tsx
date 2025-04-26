
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X, Image } from "lucide-react";
import { Link } from "react-router-dom";

interface AlbumCardProps {
  id: string;
  title: string;
  photoCount: number;
  coverUrl?: string;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const AlbumCard = ({ id, title, photoCount, coverUrl, onRename, onDelete }: AlbumCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename(id, newTitle);
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/album/${id}`} className={isEditing ? 'pointer-events-none' : ''}>
        <div className="relative aspect-square overflow-hidden">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={title} 
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Image size={64} className="text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
            {photoCount} фото
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <Button size="icon" variant="ghost" onClick={handleRename}>
              <Check size={18} />
            </Button>
            <Button size="icon" variant="ghost" onClick={cancelEditing}>
              <X size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h3 className="font-medium truncate">{title}</h3>
          </div>
        )}
      </CardContent>
      
      {!isEditing && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
            <span>Переименовать</span>
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={16} />
            <span>Удалить</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AlbumCard;
