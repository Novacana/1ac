
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} - All Rights Reserved
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground">
              Datenschutzrichtlinie
            </Link>
            <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground">
              Impressum
            </Link>
            <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
