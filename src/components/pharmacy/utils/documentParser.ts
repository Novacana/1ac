
/**
 * Dieses Modul enthält Funktionen zum Parsen von Produktspezifikationen und 
 * Analysezertifikaten (Certificate of Analysis - CoA).
 */

// Typdefinitionen für extrahierte Daten
interface ExtractedTerpeneData {
  terpenes?: { name: string; percentage: string }[];
}

interface ExtractedSpecificationData {
  name?: string;
  thc?: string;
  cbd?: string;
  category?: string;
  packaging?: string;
  origin?: string;
  lab_tested?: boolean;
  effects?: string[];
  description?: string;
}

/**
 * Parst ein Terpene-CoA aus einer Datei und extrahiert die Terpendaten
 */
export const parseTerpeneCoA = async (file: File): Promise<ExtractedTerpeneData> => {
  // In einer realen Implementierung würden wir hier OCR oder PDF-Parser verwenden
  // Für diese Demo simulieren wir eine Extraktion aus dem Terpenprofil
  
  // Simulation des Dateilesens
  return new Promise((resolve) => {
    setTimeout(() => {
      // Beispielhafte Terpendaten basierend auf dem Upload-Beispiel
      const terpenes = [
        { name: "d-Limonene", percentage: "0.541" },
        { name: "trans-Nerolidol", percentage: "0.498" },
        { name: "beta-Caryophyllene", percentage: "0.435" },
        { name: "Linalool", percentage: "0.220" },
        { name: "alpha-Humulene", percentage: "0.194" },
        { name: "Beta-Myrcene", percentage: "0.144" },
        { name: "alpha-Bisabolol", percentage: "0.110" },
        { name: "Beta-Pinene", percentage: "0.092" },
        { name: "Fenchyl-Alcohol", percentage: "0.071" },
        { name: "alpha-Terpineol", percentage: "0.069" }
      ];

      // Wir könnten hier abhängig vom Dateinamen unterschiedliche Daten liefern
      if (file.name.toLowerCase().includes('terpene')) {
        resolve({ terpenes });
      } else {
        // Simulieren eines Versuchs, Terpendaten aus einem allgemeinen CoA zu extrahieren
        resolve({ terpenes: terpenes.slice(0, 3) });
      }
    }, 1000);
  });
};

/**
 * Parst eine Produktspezifikation aus einer Datei und extrahiert die Produktdaten
 */
export const parseProductSpecification = async (file: File): Promise<ExtractedSpecificationData> => {
  // In einer realen Implementierung würden wir hier OCR oder PDF-Parser verwenden
  // Für diese Demo simulieren wir eine Extraktion aus der Spezifikation
  
  // Simulation des Dateilesens
  return new Promise((resolve) => {
    setTimeout(() => {
      // Wenn der Dateiname bestimmte Schlüsselwörter enthält, nehmen wir an, dass es sich um eine Spezifikation handelt
      if (file.name.toLowerCase().includes('spec') || 
          file.name.toLowerCase().includes('spezifikation') ||
          file.name.toLowerCase().includes('cannabis')) {
        
        // Basierend auf dem Beispiel-Dokument extrahierte Daten
        resolve({
          name: "Cannabis flos",
          category: "flowers",
          thc: "25.2% - 30.80%",
          cbd: "0.9% - 1.1%",
          packaging: "PET screw top jar with tamper evident sealing, 10 g",
          lab_tested: true,
          origin: "C. sativa",
          description: "Whole flowering 1 – 5 cm, dried shoot tips of female plants of C. sativa, covered with glandular trichomes, with characteristic odor of cannabis"
        });
      } else {
        // Allgemeinere Extraktion für unbekannte Dokumenttypen
        // Versuchen wir, zumindest einige Daten zu extrahieren
        const possibleCategoryMatches = {
          oil: "oils",
          öl: "oils",
          flower: "flowers",
          blüte: "flowers",
          edible: "edibles",
          essware: "edibles",
          kosmetik: "cosmetics",
          cosmetic: "cosmetics",
          accessory: "accessories",
          zubehör: "accessories"
        };

        // Versuche anhand des Dateinamens die Kategorie zu erraten
        const fileName = file.name.toLowerCase();
        let category = undefined;
        
        for (const [key, value] of Object.entries(possibleCategoryMatches)) {
          if (fileName.includes(key)) {
            category = value;
            break;
          }
        }

        // Minimale Extraktion
        resolve({
          category,
          lab_tested: true
        });
      }
    }, 800);
  });
};

/**
 * Verknüpft extrahierte Daten aus mehreren Quellen
 */
export const combineExtractedData = (
  specData: ExtractedSpecificationData, 
  terpeneData: ExtractedTerpeneData
): ExtractedSpecificationData & ExtractedTerpeneData => {
  return {
    ...specData,
    ...terpeneData
  };
};

/**
 * Generiert eine Produktbeschreibung aus extrahierten Daten
 */
export const generateProductDescription = (data: ExtractedSpecificationData & ExtractedTerpeneData): string => {
  let description = data.description || "";
  
  // Füge THC/CBD-Informationen hinzu
  if (data.thc || data.cbd) {
    description += description ? "\n\n" : "";
    description += "Inhaltsstoffe:";
    if (data.thc) description += `\n- THC: ${data.thc}`;
    if (data.cbd) description += `\n- CBD: ${data.cbd}`;
  }
  
  // Füge Terpenprofil hinzu, wenn verfügbar
  if (data.terpenes && data.terpenes.length > 0) {
    description += description ? "\n\n" : "";
    description += "Terpenprofil:";
    
    // Sortiere und zeige die Top-5 Terpene
    const sortedTerpenes = [...data.terpenes]
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
      .slice(0, 5);
    
    sortedTerpenes.forEach(terpene => {
      description += `\n- ${terpene.name}: ${terpene.percentage}%`;
    });
  }
  
  // Füge GDPR-konformen Haftungsausschluss hinzu
  description += "\n\nHinweis: Die angegebenen Werte können je nach Charge variieren.";
  
  return description;
};
