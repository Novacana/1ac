import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductDetail, { ProductDetailProps } from "@/components/ProductDetail";
import ProductLoading from "@/components/ProductLoading";
import ProductNotFound from "@/components/ProductNotFound";

// Sample product data array
const products: ProductDetailProps[] = [
  {
    id: "1",
    name: "Premium Indica Blüte",
    price: 49.99,
    description: "Diese Premium-Indica-Sorte liefert ein kraftvolles Körperhigh, das Spannungen löst und tiefe Entspannung bewirkt. Organisch in kontrollierten Umgebungen angebaut, um maximale Potenz und Konsistenz zu gewährleisten. Jede Charge wird von Hand getrimmt und für optimalen Geschmack, Aroma und Wirkung gehärtet.",
    images: [
      "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=640&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536062385202-b11e6f2745f1?q=80&w=640&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587754568293-1beb674e1e44?q=80&w=640&auto=format&fit=crop",
    ],
    thc: "22%",
    cbd: "0.5%",
    category: "Blüten",
    benefits: [
      "Linderung von chronischen Schmerzen und Entzündungen",
      "Fördert tiefen, erholsamen Schlaf",
      "Reduziert Angstzustände und Stress",
      "Entspannt Muskeln und lindert Spannungen",
    ],
    use: "Für optimale Ergebnisse mit einem hochwertigen Trockenkräuter-Verdampfer bei 180-210°C verwenden. Mit einer kleinen Menge (0,1-0,2 g) beginnen und bei Bedarf schrittweise erhöhen. Die Wirkung setzt typischerweise innerhalb von 5-10 Minuten ein und hält 2-3 Stunden an.",
    effects: ["Tiefe Entspannung", "Schmerzlinderung", "Euphorie", "Schläfrigkeit"],
    strain: "Indica",
    terpenes: [
      { name: "Myrcen", percentage: "1.2%" },
      { name: "Limonen", percentage: "0.8%" },
      { name: "Caryophyllen", percentage: "0.6%" }
    ],
    flavors: ["Erdig", "Kiefer", "Süß"],
    origin: "Indoor-Anbau, Niederlande",
    product_type: "Blüte",
    weight: "3.5g",
    potency: "Hoch"
  },
  {
    id: "2",
    name: "Vollspektrum CBD Öl",
    price: 39.99,
    description: "Unser Vollspektrum-CBD-Öl enthält alle vorteilhaften Cannabinoide und Terpene, die in Hanfpflanzen vorkommen. Die Kaltpressextraktion bewahrt die natürlichen Eigenschaften der Pflanze und gewährleistet maximale Wirksamkeit. Diese Premium-Formel wurde entwickelt, um das allgemeine Wohlbefinden ohne psychoaktive Wirkungen zu unterstützen.",
    images: [
      "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=640&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590009617786-6d054a2a3c7c?q=80&w=640&auto=format&fit=crop",
    ],
    thc: "<0.2%",
    cbd: "15%",
    category: "Öle",
    benefits: [
      "Lindert Entzündungen und Gelenkschmerzen",
      "Reduziert Angstzustände und fördert Ruhe",
      "Unterstützt gesunde Schlafzyklen",
      "Nicht-psychoaktive Wellness-Unterstützung",
    ],
    use: "1 ml (eine volle Pipette) unter die Zunge geben und 60 Sekunden halten, bevor geschluckt wird. Ein- oder zweimal täglich anwenden. Die Wirkung setzt typischerweise innerhalb von 15-45 Minuten ein und hält 4-6 Stunden an. Kontinuität ist der Schlüssel für optimale Ergebnisse.",
    effects: ["Beruhigend", "Entzündungshemmend", "Stressabbau", "Ausgleich"],
    strain: "Hanf",
    terpenes: [
      { name: "Pinen", percentage: "0.9%" },
      { name: "Linalool", percentage: "0.7%" }
    ],
    flavors: ["Kräuter", "Nussig", "Natürlich"],
    origin: "Bio-Hanffarmen, Colorado",
    product_type: "Tinktur",
    weight: "30ml",
    potency: "Mittel"
  },
  {
    id: "3",
    name: "Premium THC Vape Kartusche",
    price: 34.99,
    description: "Unsere Destillat-Vape-Kartuschen liefern reines THC ohne Zusatzstoffe oder Streckmittel. Jede Kartusche ist mit sortenspezifischen Terpenen für ein authentisches Cannabis-Erlebnis gefüllt. Die Keramikspulen-Technologie sorgt für reinen Geschmack und gleichmäßige Dampfproduktion.",
    images: [
      "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=640&auto=format&fit=crop",
    ],
    thc: "85%",
    cbd: "0%",
    category: "Vapes",
    benefits: [
      "Schnell wirkende Linderung innerhalb von Minuten",
      "Präzise Dosierungskontrolle",
      "Diskret mit minimalem Geruch",
      "Keine Verbrennung oder schädlicher Rauch",
    ],
    use: "An einen kompatiblen 510-Thread-Akku anschließen. Kleine Inhalationen (2-3 Sekunden) nehmen und 5-10 Minuten zwischen den Dosen warten, um die Wirkung einzuschätzen. Die Wirkung hält typischerweise 1-3 Stunden an.",
    effects: ["Sofortige Linderung", "Euphorie", "Kreativität", "Fokus"],
    strain: "Hybrid",
    terpenes: [
      { name: "Terpinolen", percentage: "3.2%" },
      { name: "Ocimen", percentage: "2.1%" }
    ],
    flavors: ["Zitrus", "Tropisch", "Süß"],
    origin: "Kalifornien",
    product_type: "510 Thread Kartusche",
    weight: "1g",
    potency: "Sehr Hoch"
  },
  {
    id: "4",
    name: "CBD Relief Cream",
    price: 29.99,
    description: "Dieses premium-reliefe-creme kombiniert 500mg CBD mit Arnica, Menthol und Essenzöl für zielgerichtete Schmerzbehandlung. Die schnell-absorbierende Formel bietet kühles Gefühl und reduziert Entzündungen. Spezifisch für Athleten und Menschen mit aktiven Lebensläufen entwickelt.",
    images: [
      "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=640&auto=format&fit=crop",
    ],
    thc: "0%",
    cbd: "5%",
    category: "Topicals",
    benefits: [
      "Zielgerichtete Linderung für Muskeln und Gelenke",
      "Reduziert Entzündungen und Schwelle",
      "Kühles Gefühl bietet sofortige Komfort",
      "Keine Systemabsorption oder psychoaktive Wirkungen",
    ],
    use: "An eine große Menge auf das betroffene Gebiet anwenden und mit Geste massieren, bis absorbiert. Bis zu vier mal täglich anwenden, je nach Bedarf. Nach Anwendung handeln Sie die Hände ab.",
    effects: ["Lokale Linderung", "Kühles Gefühl", "Entzündungshemmung"],
    strain: "Hemp-Derivat",
    terpenes: [
      { name: "Bisabolol", percentage: "0.5%" },
      { name: "Humulene", percentage: "0.4%" }
    ],
    flavors: ["Menthol", "Eucalyptus", "Clean"],
    origin: "USA",
    product_type: "Topical Cream",
    weight: "100ml",
    potency: "Mittel"
  },
  {
    id: "5",
    name: "THC-Infused Fruit Gummies",
    price: 24.99,
    description: "Unser delikates fruchtfarbener gummig ist mit genau gemessenen THC für eine konstante Erfahrung ausgestattet. Mit echten Fruchtextraktionen und organischen Zutaten für ein superiores Geschmack und Effekt. Jedes Gummig ist mit premium cannabis-Distillat infiziert, um eine sichere Potenz zu gewährleisten.",
    images: [
      "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=640&auto=format&fit=crop",
    ],
    thc: "5mg pro Stück",
    cbd: "0mg",
    category: "Edibles",
    benefits: [
      "Langsame Wirkung (4-8 Stunden)",
      "Präzise, konstante Dosierung",
      "Diskret konsumierbarer Methode",
      "Delikates Geschmackprofil",
    ],
    use: "Beginnen Sie mit einem Gummig (5mg THC) und warten Sie mindestens 60-90 Minuten, bevor mehr angenommen wird. Die Wirkung setzt typischerweise innerhalb von 30-90 Minuten ein und kann bis zu 4-8 Stunden anhalten. Speichern Sie im kühlen und trockenen Ort aus dem direkten Sonnenschein fern.",
    effects: ["Langsame Linderung", "Euphorie", "Mood-Verstärkung", "Essensteigerung"],
    strain: "Sativa",
    terpenes: [
      { name: "Limonene", percentage: "1.0%" }
    ],
    flavors: ["Strawberry", "Watermelon", "Blueberry", "Mango"],
    origin: "Made in Canada",
    product_type: "Edible",
    weight: "100mg total (20 Stück × 5mg)",
    potency: "Mittel"
  },
  {
    id: "6",
    name: "Premium Herb Grinder",
    price: 19.99,
    description: "Diese 4-Piece CNC-machinen aluminium-Grinder mit diamantgestrichenen Zähnen für effiziente Grindung, einem Pollenscreen und einem Kief-Catcher, um wertvolle Trichome zu sammeln. Entwickelt für Dauer und Leistung, es ist ein essentieller Werkzeug für jeden Fan.",
    images: [
      "https://images.unsplash.com/photo-1603851887849-5eca2b0f8fae?q=80&w=640&auto=format&fit=crop",
    ],
    category: "Accessories",
    benefits: [
      "Gleichmäßig gründet Herbs für effiziente Verdampfung",
      "Sammt wertvolle Kief/Pollen sammeln",
      "Dauerhaftes Luft- und Stahl-Grundmaterial",
      "Gleichmäßige Magneten-Schließsystem",
    ],
    use: "Platzieren Sie Material zwischen den Zähnen der oberen beiden Teile, schließen Sie sie und twisten sie zurück und wiederum, bis die gewünschte Konzentrationsstufe erreicht ist. Die feine Netzscreen trennt Pflanzenmaterial von Kief, der in die untere Kammer gesammelt wird.",
    effects: [],
    product_type: "Grinder",
    weight: "85g",
    origin: "Deutschland"
  },
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching product with ID:", id);
    setIsLoading(true);
    
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id) || null;
      console.log("Found product:", foundProduct);
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <Layout>
      <ProductDetail {...product} />
    </Layout>
  );
};

export default Product;
