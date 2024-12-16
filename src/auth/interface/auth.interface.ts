import { User } from '@prisma/client';

export interface AuthInterface {
  user: Omit<User, 'password'>;
  token: string;
}
