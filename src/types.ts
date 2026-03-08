export interface Rating {
  overall: number;
  easeOfUse: number;
  features: number;
  valueForMoney: number;
  performance: number;
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  imageUrl: string;
  pricing: string;
  rating: Rating;
  pros: string[];
  cons: string[];
  features: string[];
  websiteUrl: string;
  content: string;
  dateAdded: string;
  homeSection: 'latest' | 'popular' | 'new';
  ctaText?: string;
  ctaLink?: string;
  ctaPosition?: 'top' | 'bottom' | 'both' | 'none';
}

export interface AdSettings {
  headerAd: string;
  afterFirstParagraph: string;
  middleArticle: string;
  beforeConclusion: string;
  sidebarAd: string;
  footerAd: string;
}

export interface Comment {
  id: string;
  toolId: string;
  userName: string;
  userEmail: string;
  rating: number;
  text: string;
  createdAt: string;
  reply?: string;
  isRead?: boolean;
}

export interface CategoryGroup {
  name: string;
  categories: string[];
}

export interface SiteSettings {
  footerCategories: string[];
  categoryGroups: CategoryGroup[];
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterButtonText: string;
  newsletterSuccessMsg: string;
  newsletterAutomationText: string;
  newsletterAutomationPdfUrl: string;
  logoText: string;
  slogan: string;
  privacyPolicy: string;
  termsOfService: string;
  aboutUs: string;
  contactUs: string;
  postsPerSection: number;
  categories: string[];
  headerTitle: string;
  headerSubtitle: string;
  headerDescription: string;
  headerImageUrl: string;
  preFooterTitle1: string;
  preFooterDesc1: string;
  preFooterTitle2: string;
  preFooterDesc2: string;
  preFooterTitle3: string;
  preFooterDesc3: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'click';
  toolId: string;
  timestamp: any; // Firestore timestamp
}

export interface ToolStats {
  views: number;
  clicks: number;
}
