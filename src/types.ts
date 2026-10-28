export type Chamber = 'Diputados' | 'Senado' | 'Congreso Unificado';

export type BillStatus = 
  | 'Convocado a Sesión' 
  | 'En Debate en Recinto' 
  | 'Aprobado en Diputados (Pasa a Senado)' 
  | 'Dictamen de Comisión (Listo para Votar)';

export interface LawBill {
  id: string;
  title: string;
  expediente: string;
  chamber: Chamber;
  status: BillStatus;
  date: string;
  tags: string[];
  summary: {
    whatChanges: string;
    proArgs: string;
    conArgs: string;
  };
  votesCommunity: {
    yes: number;
    no: number;
  };
  votesCertified: {
    yes: number;
    no: number;
  };
  userVoted: 'yes' | 'no' | null;
  congressResult?: {
    status: 'Aprobado' | 'Rechazado' | 'Pendiente';
    yesCount?: number;
    noCount?: number;
    abstainCount?: number;
    date?: string;
    verdict?: string;
  };
  nullifierHash?: string;
  officialDocUrl: string;
}

export type NewsCategory = 'Todos' | 'Política' | 'Economía' | 'Sociedad' | 'Tecnología' | 'Espectáculos' | 'Deportes';

export interface NewsArticle {
  id: string;
  source: string;
  sourceLogoText: string;
  category: NewsCategory;
  title: string;
  timeAgo: string;
  bullets: string[];
  readTime: string;
  url: string;
  likes: number;
  userLiked?: boolean;
}

export interface CommunityPoll {
  id: string;
  author: string;
  isAuthorVerified: boolean;
  category: string;
  question: string;
  context?: string;
  votes: {
    yes: number;
    no: number;
  };
  userVoted: 'yes' | 'no' | null;
  commentsCount: number;
  timeAgo: string;
  isTrending?: boolean;
}

export interface UserVerificationState {
  phone: string;
  isPhoneVerified: boolean;
  isPasskeyActive: boolean;
  isCertified: boolean;
  certificationMethod: 'World ID' | 'DNI + Selfie' | 'DNI NFC' | null;
  nullifierSeed: string;
  voterBadgeId: string;
}
