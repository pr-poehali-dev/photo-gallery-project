
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Check, X } from "lucide-react";

interface CreateAlbumCardProps {
  onCreateAlbum: (title: string) => void;
}

const CreateAlbumCard = ({ onCreateAlbum }: CreateAlbumCardProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      onCreateAlbum(title);
      setTitle("");
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsCreating(false);
  };

  return (
    <Card className="h-full">
      {isCreating ? (
        <CardContent className="p-4 flex flex-col h-full">
          <h3 className="font-medium mb-4">Новый альбом</h3>
          <Input
            placeholder="Название альбома"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
            autoFocus
          />
          <div className="flex gap-2 mt-auto">
            <Button onClick={handleCreate} className="flex-1">
              <Check size={16} />
              <span>Создать</span>
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X size={16} />
              <span>Отмена</span>
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-0 h-full">
          <Button
            variant="ghost"
            className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-none hover:bg-muted"
            onClick={() => setIsCreating(true)}
          >
            <div className="rounded-full bg-muted p-4">
              <Plus size={24} />
            </div>
            <span>Создать альбом</span>
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default CreateAlbumCard;
