
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface PhotoUploaderProps {
  files: File[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[], titles: string[]) => void;
  isUploading: boolean;
}

const PhotoUploader = ({ files, open, onOpenChange, onUpload, isUploading }: PhotoUploaderProps) => {
  const [titles, setTitles] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Инициализация заголовков на основе имен файлов
    if (files.length > 0) {
      setTitles(files.map(file => {
        // Удаляем расширение файла
        const name = file.name.split('.').slice(0, -1).join('.');
        return name;
      }));
    }
  }, [files]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isUploading) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    
    return () => {
      clearInterval(timer);
      if (!isUploading) {
        setProgress(0);
      }
    };
  }, [isUploading]);

  const handleTitleChange = (index: number, newTitle: string) => {
    const newTitles = [...titles];
    newTitles[index] = newTitle;
    setTitles(newTitles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    const newTitles = [...titles];
    newTitles.splice(index, 1);
    
    // Обновляем состояние через props
    // В реальном приложении нужно обновить состояние в родительском компоненте
    if (newFiles.length === 0) {
      onOpenChange(false);
    }
  };

  const handleUpload = () => {
    onUpload(files, titles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Загрузка фотографий</DialogTitle>
        </DialogHeader>
        
        {isUploading ? (
          <div className="space-y-4 py-6">
            <div className="text-center mb-4">
              <p className="mb-2">Загрузка фотографий...</p>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex gap-4 mb-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} МБ
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFile(index)}
                        className="h-8 w-8"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Название фотографии"
                      value={titles[index] || ''}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpload} disabled={files.length === 0}>
                <Upload size={16} className="mr-2" />
                Загрузить {files.length} фото
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploader;
