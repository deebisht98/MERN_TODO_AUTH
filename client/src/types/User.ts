export interface Preferences {
  theme: string;
  notifications: string;
  language: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: Preferences;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
