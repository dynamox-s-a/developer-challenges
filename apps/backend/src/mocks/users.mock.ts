export const mockedUsers = [
  {
    id: 1,
    name: 'Leonardo Jacomussi',
    email: 'leonardo@email.com',
    password: '#UmaSenhaSegura123',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@email.com',
    password: '@AnotherSecurePassword123',
  }
];

export const mockedUsersPrisma = {
  user: {
    create: jest.fn().mockReturnValue(mockedUsers[1]),
    findUnique: jest.fn().mockImplementation((args) => {
      if (args.where.email) {
        return null;
      }
      if (args.where.id) {
        return mockedUsers.filter((user) => user.id === args.where.id)[0];
      }
    }),
    findMany: jest.fn().mockResolvedValue(mockedUsers),
    update: jest.fn().mockResolvedValue(mockedUsers[0]),
    delete: jest.fn(),
  },
};
