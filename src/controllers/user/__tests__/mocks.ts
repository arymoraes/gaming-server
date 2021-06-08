// eslint-disable-next-line import/prefer-default-export
export const mockUser = {
  regular: {
    username: 'test',
    password: 'testtest',
    email: 'test@test.com',
  },
  noUsername: {
    password: 'testtest',
    email: 'test@test.com',
  },
  noEmail: {
    username: 'test',
    password: 'testtest',
  },
  noPassword: {
    username: 'test',
    email: 'test@test.com',
  },
  smallpassword: {
    username: 'test',
    password: 'smal',
    email: 'test@test.com',
  },
  notAnEmail: {
    username: 'test',
    password: 'testtest',
    email: 'testtest.com',
  },
  sameUsername: {
    username: 'test',
    password: 'testtest',
    email: 'test2@test.com',
  },
  sameEmail: {
    username: 'test2',
    password: 'testtest',
    email: 'test@test.com',
  },
};