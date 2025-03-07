
import { ProductDetailProps } from "@/components/ProductDetail";

export const oilsProducts: ProductDetailProps[] = [
  {
    id: "14",
    name: "CBD Vollspektrum Öl 10%",
    price: 59.99,
    description: "Unser Premium CBD Vollspektrum Öl enthält die volle Kraft der Cannabis-Pflanze mit allen natürlichen Cannabinoiden, Terpenen und Flavonoiden. Diese synergistische Kombination sorgt für einen verstärkten therapeutischen Effekt, bekannt als Entourage-Effekt.",
    images: [
      "public/lovable-uploads/5ab221cf-6167-4c7a-9c6f-3ba8f9f37d5d.png",
      "public/lovable-uploads/e309be49-454e-4b04-b656-75ae60cb7145.png"
    ],
    thc: "<0.2%",
    cbd: "10%",
    category: "Öle",
    benefits: [
      "Unterstützt das Endocannabinoid-System",
      "Fördert allgemeines Wohlbefinden",
      "Hilft bei Stress und innerer Unruhe",
      "Unterstützt gesunden Schlaf"
    ],
    use: "2-3 Tropfen unter die Zunge geben und 60 Sekunden halten, bevor das Öl geschluckt wird. Mit einer niedrigen Dosierung beginnen und bei Bedarf steigern. Optimal morgens und/oder abends einnehmen.",
    effects: ["Entspannung", "Angstlösend", "Entzündungshemmend", "Schlaffördernd"],
    strain: "Gemischt",
    terpenes: [
      { name: "Myrcen", percentage: "0.3%" },
      { name: "Limonen", percentage: "0.2%" },
      { name: "Pinen", percentage: "0.1%" }
    ],
    flavors: ["Erdig", "Nussig", "Krautig"],
    origin: "EU-zertifizierter Hanf",
    product_type: "Öl",
    weight: "10ml",
    potency: "Mittel"
  },
  {
    id: "15",
    name: "THC:CBD 1:1 Öl",
    price: 69.99,
    description: "Unser ausgewogenes THC:CBD 1:1 Öl bietet die perfekte Balance zwischen therapeutischen Eigenschaften beider Cannabinoide. Diese harmonische Kombination sorgt für potenzielle medizinische Vorteile mit reduziertem psychoaktivem Effekt durch die ausgleichende Wirkung des CBD.",
    images: [
      "public/lovable-uploads/f7dcbc87-d445-4dba-9119-0a44108a567c.png",
      "public/lovable-uploads/2e49b88e-56ed-4d1e-9b78-6ed041d8fda5.png"
    ],
    thc: "5%",
    cbd: "5%",
    category: "Öle",
    benefits: [
      "Ausgewogene Wirkung von THC und CBD",
      "Effektive Schmerzlinderung",
      "Reduziert Entzündungen",
      "Fördert Entspannung ohne starke Sedierung"
    ],
    use: "Mit 2-3 Tropfen beginnen, unter die Zunge geben und 60 Sekunden halten. Wirkung tritt nach 15-30 Minuten ein und hält 4-6 Stunden an. Abends oder bei chronischen Schmerzen anwenden.",
    effects: ["Schmerzlinderung", "Entspannung", "Leicht euphorisch", "Entzündungshemmend"],
    strain: "Hybrid",
    terpenes: [
      { name: "Myrcen", percentage: "0.4%" },
      { name: "Caryophyllen", percentage: "0.3%" },
      { name: "Limonen", percentage: "0.2%" }
    ],
    flavors: ["Kräuterig", "Zitrus", "Erdig"],
    origin: "Medizinischer Cannabis EU",
    product_type: "Öl",
    weight: "30ml",
    potency: "Hoch"
  }
];
