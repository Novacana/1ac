
import { ProductDetailProps } from "@/components/ProductDetail";

export const indicaProducts: ProductDetailProps[] = [
  {
    id: "13",
    name: "Purple Kush",
    price: 45.99,
    description: "Purple Kush ist eine reine Indica-Sorte mit atemberaubenden violetten Blüten und dichter Trichombedeckung. Diese visuell beeindruckende Sorte bietet eine tiefe, körperliche Entspannung und sanfte Euphorie, perfekt zur Stressabbau und Schmerzlinderung am Ende eines langen Tages.",
    images: [
      "public/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png",
      "public/lovable-uploads/d309619a-3ff7-42f3-b273-ab1586713f9f.png"
    ],
    image: "public/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png",
    thc: "20%",
    cbd: "0.1%",
    category: "Blüten",
    benefits: [
      "Tiefe körperliche Entspannung",
      "Effektive Schmerzlinderung",
      "Fördert Schlaf und Ruhe",
      "Lindert Muskelverspannungen und Krämpfe"
    ],
    use: "Ideal für den abendlichen Gebrauch. Bei höheren Temperaturen (190-210°C) verdampfen für maximale entspannende Wirkung. Die Wirkung kann länger anhalten, daher sollte für ausreichend Ruhezeit gesorgt werden.",
    effects: ["Tiefe Entspannung", "Euphorie", "Schmerzlinderung", "Schlaffördernd"],
    strain: "Indica",
    terpenes: [
      { name: "Myrcen", percentage: "1.4%" },
      { name: "Linalool", percentage: "0.9%" },
      { name: "Caryophyllen", percentage: "0.6%" }
    ],
    flavors: ["Süß", "Beere", "Trauben", "Erdig"],
    origin: "Indoor-Anbau, Kanada",
    product_type: "Blüte",
    weight: "5g",
    potency: "Hoch"
  }
];
