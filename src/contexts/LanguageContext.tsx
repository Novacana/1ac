
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Allgemeine Texte
  "back_to_products": {
    de: "Zurück zu Produkten",
    en: "Back to products",
  },
  "add_to_cart": {
    de: "In den Warenkorb",
    en: "Add to Cart",
  },
  "added_to_cart": {
    de: "Zum Warenkorb hinzugefügt",
    en: "Added to Cart",
  },
  "quantity": {
    de: "Menge",
    en: "Quantity",
  },
  "decrease_quantity": {
    de: "Menge verringern",
    en: "Decrease quantity",
  },
  "increase_quantity": {
    de: "Menge erhöhen",
    en: "Increase quantity",
  },
  
  // Produktdetails
  "benefits": {
    de: "Vorteile",
    en: "Benefits",
  },
  "effects": {
    de: "Wirkungen",
    en: "Effects",
  },
  "how_to_use": {
    de: "Anwendung",
    en: "How to use",
  },
  
  // ProductInfoPanel
  "cannabinoid_profile": {
    de: "Cannabinoid-Profil",
    en: "Cannabinoid Profile",
  },
  "taste_profile": {
    de: "Geschmacksprofil",
    en: "Taste Profile",
  },
  "terpene_profile": {
    de: "Terpen-Profil",
    en: "Terpene Profile",
  },
  "concentration": {
    de: "Konzentration",
    en: "Concentration",
  },
  
  // Geschmacksrichtungen (Flavors)
  "Earthy": {
    de: "Erdig",
    en: "Earthy",
  },
  "Pine": {
    de: "Kiefer",
    en: "Pine",
  },
  "Sweet": {
    de: "Süß",
    en: "Sweet",
  },
  "Citrus": {
    de: "Zitrus",
    en: "Citrus",
  },
  "Tropical": {
    de: "Tropisch",
    en: "Tropical",
  },
  "Herbal": {
    de: "Kräuterig",
    en: "Herbal",
  },
  "Nutty": {
    de: "Nussig",
    en: "Nutty",
  },
  "Menthol": {
    de: "Menthol",
    en: "Menthol",
  },
  "Eucalyptus": {
    de: "Eukalyptus",
    en: "Eucalyptus",
  },
  "Clean": {
    de: "Rein",
    en: "Clean",
  },
  "Mango": {
    de: "Mango",
    en: "Mango",
  },
  "Strawberry": {
    de: "Erdbeere",
    en: "Strawberry",
  },
  "Watermelon": {
    de: "Wassermelone",
    en: "Watermelon",
  },
  "Blueberry": {
    de: "Blaubeere",
    en: "Blueberry",
  },
  "Natural": {
    de: "Natürlich",
    en: "Natural",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "de",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || "de";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
