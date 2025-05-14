// src/types/jwt.d.ts

export interface DecodedToken {
    user: string;
    [key: string]: any;
  }
  
  export interface UserState {
    email: string | null;
  }
  