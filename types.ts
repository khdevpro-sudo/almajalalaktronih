
export enum Category {
  MAIN = 'رئيسية',
  SECURITY = 'الأمن والحماية',
  SOCIAL = 'التوثيق والفك',
  E_COMMERCE = 'متجر الأرقام والبطاقات',
  GAMES = 'شحن الألعاب',
  TOOLS = 'أدوات ذكية',
  AI = 'الذكاء اصطناعي',
  MARKET = 'سوق الحسابات'
}

export interface AppSettings {
  themeColor: 'professional' | 'dark-blue' | 'light-blue';
  displayMode: 'light' | 'dark';
  cardSize: 'small' | 'medium' | 'large';
  textSize: 'small' | 'medium' | 'large';
  imageQuality: 'low' | 'medium' | 'high';
  dataSaving: boolean;
  marketSorting: 'price' | 'level' | 'status';
  showMarketImages: boolean;
  notificationsEnabled: boolean;
  orderNotifications: boolean;
  offerNotifications: boolean;
  marketNotifications: boolean;
}

export interface VirtualNumber {
  id: string;
  country: string;
  flag: string;
  code: string;
  price: number;
  services: string[]; // ['WhatsApp', 'Telegram', 'Facebook']
  type: 'SMS' | 'Call' | 'Both';
  duration: string;
  isAvailable: boolean;
}

export interface GameAccount {
  id: string;
  game: 'PUBG' | 'Free Fire' | 'COD' | 'Fortnite' | 'FIFA';
  level: number;
  skins: number;
  server: string;
  binding: string;
  price: number;
  status: 'verified' | 'pending';
  images: string[];
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: Category;
  image: string;
  fields: Field[];
  steps?: { title: string; icon: string; description: string }[];
  details?: {
    benefits: string[];
    requirements: string[];
    duration: string;
    notes: string;
  };
}

export interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'file';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}
