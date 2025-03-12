
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const VideoConsultationItem: React.FC = () => {
  return (
    <AccordionItem value="item-7">
      <AccordionTrigger>Wie funktioniert die Videosprechstunde?</AccordionTrigger>
      <AccordionContent>
        <p>
          Die Videosprechstunde basiert auf WebRTC-Technologie und funktioniert direkt im Browser. 
          Als Arzt können Sie eine Sprechstunde planen oder spontan starten. Der Patient erhält 
          einen Link zum Beitritt. Die Verbindung ist Ende-zu-Ende verschlüsselt und DSGVO-konform.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default VideoConsultationItem;
