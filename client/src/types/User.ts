export interface Preferences {
  theme: "light" | "dark" | "system";
  notifications: "all" | "important" | "none";
  language: "en" | "es" | "fr" | "de" | "zh";
}
export interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
}

export interface User {
  _id: string;
  name: string;
  bio: string;
  email: string;
  avatar: string;
  preferences: Preferences;
  token: string;
  socialLinks: SocialLinks;
  location: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
