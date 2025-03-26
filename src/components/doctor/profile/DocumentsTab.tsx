
import React from "react";
import ComplianceAlert from "./document-upload/ComplianceAlert";
import DocumentUploader from "./document-upload/DocumentUploader";
import ConsentDialog from "./document-upload/ConsentDialog";
import PrivacyInfoDialog from "./document-upload/PrivacyInfoDialog";
import { useDocumentUpload } from "./document-upload/useDocumentUpload";

const DocumentsTab: React.FC = () => {
  const {
    approbationUpload,
    specialistUpload,
    gdprConsent,
    showConsentDialog,
    showPrivacyInfo,
    setGdprConsent,
    setShowConsentDialog,
    setShowPrivacyInfo,
    handleFileUpload,
    handleConsentConfirm
  } = useDocumentUpload();

  return (
    <div className="space-y-6">
      <ComplianceAlert onInfoClick={() => setShowPrivacyInfo(true)} />
    
      <h3 className="text-lg font-medium">Approbationsnachweise</h3>
      <DocumentUploader
        title="Approbationsurkunde"
        documentType="approbation"
        uploadState={approbationUpload}
        onFileSelect={(e) => handleFileUpload(e, 'approbation')}
      />
      
      <h3 className="text-lg font-medium mt-6">Facharztnachweise</h3>
      <DocumentUploader
        title="Facharztanerkennung"
        documentType="specialist"
        uploadState={specialistUpload}
        onFileSelect={(e) => handleFileUpload(e, 'specialist')}
      />
      
      <ConsentDialog
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        gdprConsent={gdprConsent}
        setGdprConsent={setGdprConsent}
        onConfirm={handleConsentConfirm}
      />
      
      <PrivacyInfoDialog
        open={showPrivacyInfo}
        onOpenChange={setShowPrivacyInfo}
      />
    </div>
  );
};

export default DocumentsTab;
