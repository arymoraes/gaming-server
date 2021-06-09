/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { UserRole } from '../../../entities/User';

// eslint-disable-next-line import/prefer-default-export
export const mockUser = {
  regular: {
    username: 'test',
    password: 'testtest',
    email: 'test@test.com',
    isActive: true,
  },
  admin: {
    username: 'admin',
    password: 'Admin12345',
    email: 'mradmin@adminland.com',
    isActive: true,
    role: UserRole.ADMIN,
  },
  secondAdmin: {
    username: 'admin2',
    password: 'Admin123456',
    email: 'mradmin2@adminland.com',
    isActive: true,
    role: UserRole.ADMIN,
  },
};
