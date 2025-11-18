export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt: Date;
  };
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
