
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PhotosTabProps {
  onChange: () => void;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ onChange }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, this would upload the file to a server
      // Here we're just creating a local URL for demo purposes
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Die Datei ist zu groß. Maximum: 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Nur Bilddateien sind erlaubt");
        return;
      }
      
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        caption: ''
      };
      
      setPhotos([...photos, newPhoto]);
      onChange();
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success("Bild erfolgreich hinzugefügt");
    }
  };
  
  const removePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    onChange();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Fotos Ihrer Apotheke</h3>
            <p className="text-sm text-muted-foreground">
              Laden Sie Bilder Ihrer Apotheke hoch, um Kunden einen visuellen Eindruck zu vermitteln
            </p>
          </div>
          <div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <ImagePlus className="h-4 w-4" />
              Bild hochladen
            </Button>
          </div>
        </div>
      </div>
      
      {photos.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            Noch keine Bilder vorhanden. Laden Sie Bilder hoch, um Ihre Apotheke zu präsentieren.
          </p>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            Bild hinzufügen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.url} 
                alt="Apotheke" 
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removePhoto(photo.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Entfernen
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="pt-4 text-sm text-muted-foreground">
        Maximal 10 Bilder, je max. 5MB. Unterstützte Formate: JPG, PNG, GIF
      </div>
    </div>
  );
};

export default PhotosTab;
