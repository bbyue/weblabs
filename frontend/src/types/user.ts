export interface User {
  id: string;
  firstName: string;
  lasttName: string;
  middleName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
}