
import { ProductDetailProps } from "@/components/ProductDetail";

export const hybridsProducts: ProductDetailProps[] = [
  {
    id: "12",
    name: "Gelato 41",
    price: 49.99,
    description: "Gelato 41 ist eine exquisite Hybridsorte mit spektakulär bunten Blüten, die von tiefem Lila bis zu leuchtendem Grün reichen. Diese Premium-Sorte bietet ein perfektes Gleichgewicht zwischen Euphorie und körperlicher Entspannung mit einem komplexen, dessertähnlichen Geschmacksprofil.",
    images: [
      "public/lovable-uploads/dc40d978-afef-449a-8fd1-ebd973d2ec3f.png",
      "public/lovable-uploads/6056859b-68b7-449a-b5c1-f8f4f654b38e.png"
    ],
    image: "public/lovable-uploads/dc40d978-afef-449a-8fd1-ebd973d2ec3f.png",
    thc: "23%",
    cbd: "0.1%",
    category: "Blüten",
    benefits: [
      "Ausgewogene Effekte für Geist und Körper",
      "Hebt die Stimmung ohne Überstimulation",
      "Mildert chronische Schmerzen und Entzündungen",
      "Fördert Entspannung ohne starke Sedierung"
    ],
    use: "Für optimale Ergebnisse bei mittleren Temperaturen (180-195°C) verdampfen, um das volle Geschmacksprofil zu erleben. Aufgrund der hohen Potenz mit einer kleinen Dosis beginnen und langsam steigern.",
    effects: ["Ausgeglichen", "Euphorie", "Entspannung", "Kreativität"],
    strain: "Balanced Hybrid",
    terpenes: [
      { name: "Caryophyllen", percentage: "0.9%" },
      { name: "Limonen", percentage: "0.8%" },
      { name: "Linalool", percentage: "0.5%" }
    ],
    flavors: ["Süß", "Beere", "Zitrus", "Dessert"],
    origin: "Indoor-Anbau, Kalifornien",
    product_type: "Blüte",
    weight: "3.5g",
    potency: "Sehr Hoch"
  }
];
