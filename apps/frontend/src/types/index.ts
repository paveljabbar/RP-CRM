export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface Customer {
  id: number;
  category?: string;
  advisorId?: number;
  language?: string;
  noContact: boolean;
  gender?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  maritalStatus?: string;
  birthDate?: string;
  ahvNumber?: string;
  nationality?: string;
  foreignPermit?: string;
  street?: string;
  zip?: number;
  city?: string;
  livingSituation?: string;
  occupation?: string;
  mobileCode?: string;
  mobile?: string;
  workPhoneCode?: string;
  workPhone?: string;
  privateEmailPart1?: string;
  privateEmailPart2?: string;
  workEmailPart1?: string;
  workEmailPart2?: string;
  recommendation?: string;
  relationToRecommender?: string;
  userId: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  advisor?: User;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}
