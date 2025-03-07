
import { ProductDetailProps } from "@/components/ProductDetail";

// Sample product data array
export const products: ProductDetailProps[] = [
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
  // Neue Produkte basierend auf den hochgeladenen Bildern
  {
    id: "7",
    name: "Northern Lights CBD",
    price: 42.99,
    description: "Northern Lights CBD ist eine legendäre Indica-dominante Sorte mit einem hohen CBD-Gehalt und moderatem THC-Niveau. Die kristallbedeckten, dichten Blüten bieten Entspannung ohne starke Sedierung. Perfekt für medizinische Anwender, die Schmerzen lindern möchten, während sie funktionsfähig bleiben.",
    images: [
      "public/lovable-uploads/5ab221cf-6167-4c7a-9c6f-3ba8f9f37d5d.png",
      "public/lovable-uploads/e309be49-454e-4b04-b656-75ae60cb7145.png"
    ],
    thc: "10%",
    cbd: "12%",
    category: "Blüten",
    benefits: [
      "Ausgewogene Wirkung für Tag und Nacht",
      "Schmerzlinderung ohne starke Sedierung",
      "Reduziert Entzündungen und Muskelverspannungen",
      "Unterstützt ruhigen, erholsamen Schlaf"
    ],
    use: "Mit einem Vaporizer bei 180-195°C für optimale Terpene und Cannabinoide verwenden. Beginnen Sie mit einer kleinen Menge, besonders wenn Sie empfindlich auf THC reagieren.",
    effects: ["Entspannung", "Schmerzlinderung", "Stressabbau", "Leichte Euphorie"],
    strain: "Indica-dominant Hybrid",
    terpenes: [
      { name: "Myrcen", percentage: "0.8%" },
      { name: "Pinen", percentage: "0.5%" },
      { name: "Linalool", percentage: "0.4%" }
    ],
    flavors: ["Kiefer", "Süß", "Würzig", "Erdig"],
    origin: "Indoor-Anbau, Schweiz",
    product_type: "Blüte",
    weight: "5g",
    potency: "Mittel"
  },
  {
    id: "8",
    name: "Amnesia Haze",
    price: 46.99,
    description: "Amnesia Haze ist eine preisgekrönte Sativa-dominante Sorte mit leuchtend grünen, harzigen Blüten und charakteristischen orangefarbenen Härchen. Diese energiespendende Sorte bietet einen klaren, kreativen Kopf-High mit einer subtilen körperlichen Entspannung, perfekt für tägliche Aktivitäten.",
    images: [
      "public/lovable-uploads/51f7c998-91ad-4cf3-ba40-81d2f23bbddc.png",
      "public/lovable-uploads/d7b32644-0f4d-443e-9c1a-e2fdab15fd76.png"
    ],
    thc: "20%",
    cbd: "0.1%",
    category: "Blüten",
    benefits: [
      "Steigert Kreativität und Fokus",
      "Milde Stimmungsaufhellung",
      "Erhöht Energie und Motivation",
      "Mildert Erschöpfung und Lethargie"
    ],
    use: "Ideal für den Tagesgebrauch. Für optimale Ergebnisse bei niedrigeren Temperaturen (165-180°C) verdampfen, um die belebenden Terpene zu erhalten. Vorsicht bei Anfängern wegen des hohen THC-Gehalts.",
    effects: ["Energiesteigernd", "Euphorie", "Kreativität", "Fokus"],
    strain: "Sativa-dominant",
    terpenes: [
      { name: "Terpinolen", percentage: "1.0%" },
      { name: "Limonen", percentage: "0.9%" },
      { name: "Caryophyllen", percentage: "0.3%" }
    ],
    flavors: ["Zitrus", "Würzig", "Süß"],
    origin: "Indoor-Anbau, Niederlande",
    product_type: "Blüte",
    weight: "3.5g",
    potency: "Hoch"
  },
  {
    id: "9",
    name: "Black Domina",
    price: 44.99,
    description: "Black Domina ist eine kraftvolle Indica mit charakteristisch dunklen, fast schwarzen Blättern und dichter, harziger Blütenstruktur. Diese Sorte bietet eine tiefe, schwere körperliche Entspannung mit sedierenden Eigenschaften, ideal für abendliche Entspannung und Schmerztherapie.",
    images: [
      "public/lovable-uploads/8db2393e-a67f-435f-9eb7-467e1a367470.png",
      "public/lovable-uploads/431a2c6a-1009-4805-ada8-1a396cdafa29.png"
    ],
    thc: "18%",
    cbd: "0.3%",
    category: "Blüten",
    benefits: [
      "Tiefgreifende Muskelentspannung",
      "Fördert tiefen, erholsamen Schlaf",
      "Starke Schmerzlinderung",
      "Hilft bei Schlaflosigkeit und Unruhe"
    ],
    use: "Abends oder nachts verwenden, wenn keine weiteren Aktivitäten geplant sind. Ideal für die Verwendung 1-2 Stunden vor dem Schlafengehen. Bei höheren Temperaturen (190-210°C) verdampfen für maximale Entspannungseffekte.",
    effects: ["Tiefe Entspannung", "Sedierung", "Schmerzlinderung", "Schläfrigkeit"],
    strain: "Indica",
    terpenes: [
      { name: "Myrcen", percentage: "1.3%" },
      { name: "Linalool", percentage: "0.6%" },
      { name: "Humulen", percentage: "0.4%" }
    ],
    flavors: ["Erdig", "Haschartig", "Kräutrig", "Holzig"],
    origin: "Indoor-Anbau, Spanien",
    product_type: "Blüte",
    weight: "5g",
    potency: "Sehr Hoch"
  },
  {
    id: "10",
    name: "Jack Herer",
    price: 45.99,
    description: "Jack Herer ist eine ausgewogene Hybrid-Sorte mit leuchtend grünen, dichten Blüten und reichlich Harzkristallen. Diese beliebte medizinische Sorte kombiniert kreative Klarheit mit sanfter Entspannung, ohne Müdigkeit zu verursachen - ideal für Patienten, die tagsüber aktiv bleiben müssen.",
    images: [
      "public/lovable-uploads/f7dcbc87-d445-4dba-9119-0a44108a567c.png",
      "public/lovable-uploads/2e49b88e-56ed-4d1e-9b78-6ed041d8fda5.png"
    ],
    thc: "19%",
    cbd: "0.2%",
    category: "Blüten",
    benefits: [
      "Ausgewogene Wirkung für geistige und körperliche Entspannung",
      "Fördert Kreativität ohne Lethargie",
      "Reduziert Stress und leichte Schmerzen",
      "Erhöht Konzentration und Fokus"
    ],
    use: "Vielseitig einsetzbar zu jeder Tageszeit. Für optimale Ergebnisse zwischen 175-190°C verdampfen. Gute Einstiegssorte für therapeutische Anwender, die klaren Kopf behalten wollen.",
    effects: ["Ausgeglichen", "Kreativität", "Mild euphorisch", "Fokussiert"],
    strain: "Balanced Hybrid",
    terpenes: [
      { name: "Pinen", percentage: "0.9%" },
      { name: "Terpinolen", percentage: "0.7%" },
      { name: "Caryophyllen", percentage: "0.5%" }
    ],
    flavors: ["Kiefer", "Zitrus", "Würzig", "Holzig"],
    origin: "Indoor-Anbau, Kalifornien",
    product_type: "Blüte",
    weight: "3.5g",
    potency: "Hoch"
  },
  {
    id: "11",
    name: "Super Silver Haze",
    price: 47.99,
    description: "Super Silver Haze ist eine vielfach preisgekrönte Sativa mit silbrig-glänzenden Trichomen und langen, hellgrünen Blüten. Diese energiegeladene Sorte bietet eine langanhaltende zerebrale Wirkung kombiniert mit leichter körperlicher Entspannung, ideal für kreative Projekte und soziale Situationen.",
    images: [
      "public/lovable-uploads/e8108207-f6a3-46fa-955d-2eec65d1d013.png",
      "public/lovable-uploads/ec590630-2962-446a-b8cc-9b7fce1ae53a.png"
    ],
    thc: "21%",
    cbd: "0.1%",
    category: "Blüten",
    benefits: [
      "Langanhaltende Energie ohne Nervosität",
      "Fördert geistige Klarheit und Kreativität",
      "Lindert chronische Erschöpfung und Depression",
      "Hilft bei ADHS und Konzentrationsschwierigkeiten"
    ],
    use: "Ideal für den morgendlichen oder nachmittäglichen Gebrauch. Bei niedrigen Temperaturen (165-175°C) verdampfen, um die aufmunternden Terpene zu maximieren. Wegen des hohen THC-Gehalts mit einer kleinen Dosis beginnen.",
    effects: ["Energetisch", "Kreativ", "Geistig klar", "Mild euphorisch"],
    strain: "Sativa",
    terpenes: [
      { name: "Limonen", percentage: "1.1%" },
      { name: "Terpinolen", percentage: "0.8%" },
      { name: "Ocimen", percentage: "0.6%" }
    ],
    flavors: ["Zitrus", "Würzig", "Haze", "Süß"],
    origin: "Indoor-Anbau, Amsterdam",
    product_type: "Blüte",
    weight: "5g",
    potency: "Sehr Hoch"
  },
  {
    id: "12",
    name: "Gelato 41",
    price: 49.99,
    description: "Gelato 41 ist eine exquisite Hybridsorte mit spektakulär bunten Blüten, die von tiefem Lila bis zu leuchtendem Grün reichen. Diese Premium-Sorte bietet ein perfektes Gleichgewicht zwischen Euphorie und körperlicher Entspannung mit einem komplexen, dessertähnlichen Geschmacksprofil.",
    images: [
      "public/lovable-uploads/dc40d978-afef-449a-8fd1-ebd973d2ec3f.png",
      "public/lovable-uploads/6056859b-68b7-449a-b5c1-f8f4f654b38e.png"
    ],
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
  },
  {
    id: "13",
    name: "Purple Kush",
    price: 45.99,
    description: "Purple Kush ist eine reine Indica-Sorte mit atemberaubenden violetten Blüten und dichter Trichombedeckung. Diese visuell beeindruckende Sorte bietet eine tiefe, körperliche Entspannung und sanfte Euphorie, perfekt zur Stressabbau und Schmerzlinderung am Ende eines langen Tages.",
    images: [
      "public/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png",
      "public/lovable-uploads/d309619a-3ff7-42f3-b273-ab1586713f9f.png"
    ],
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
