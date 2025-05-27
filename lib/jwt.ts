import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
  // add other token fields as needed
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
} 