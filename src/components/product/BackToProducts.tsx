
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BackToProducts: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Link
      to="/"
      className="inline-flex items-center text-sm font-medium transition-all duration-200 hover:text-primary mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      {t("back_to_products")}
    </Link>
  );
};

export default BackToProducts;
