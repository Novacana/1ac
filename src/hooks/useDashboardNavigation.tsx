
import { useState, useCallback } from 'react';

type DashboardSection = 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';

export const useDashboardNavigation = () => {
  const [mainSection, setMainSection] = useState<DashboardSection>('open_requests');

  const handleSectionChange = useCallback((section: DashboardSection) => {
    setMainSection(section);
  }, []);

  return {
    mainSection,
    handleSectionChange
  };
};
