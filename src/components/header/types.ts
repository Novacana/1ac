
export interface NavItem {
  name: string;
  path: string;
}

export interface GDPRConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  show: boolean;
}
