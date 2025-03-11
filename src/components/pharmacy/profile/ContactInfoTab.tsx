import React from "react";
import { Input } from "@/components/ui/input";
import { User } from "@/types/auth";
import { Label } from "@/components/ui/label";

interface ContactInfoTabProps {
  user: User | null;
  onChange: () => void;
}

const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ user, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Contact Person */}
      <div>
        <Label htmlFor="contactPerson">Ansprechpartner</Label>
        <Input
          type="text"
          id="contactPerson"
          defaultValue={user?.name || ""}
          onChange={onChange}
          placeholder="Name des Ansprechpartners"
        />
      </div>

      {/* Phone Number */}
      <div>
        <Label htmlFor="phoneNumber">Telefonnummer</Label>
        <Input
          type="tel"
          id="phoneNumber"
          defaultValue={user?.phone || ""}
          onChange={onChange}
          placeholder="Telefonnummer der Apotheke"
        />
      </div>

      {/* Email Address */}
      <div>
        <Label htmlFor="emailAddress">E-Mail-Adresse</Label>
        <Input
          type="email"
          id="emailAddress"
          defaultValue={user?.email || ""}
          onChange={onChange}
          placeholder="E-Mail-Adresse der Apotheke"
        />
      </div>

      {/* Website URL */}
      <div>
        <Label htmlFor="websiteURL">Webseiten-URL</Label>
        <Input
          type="url"
          id="websiteURL"
          onChange={onChange}
          placeholder="URL der Apotheken-Webseite"
        />
      </div>
    </div>
  );
};

export default ContactInfoTab;
