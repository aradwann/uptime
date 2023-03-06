// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { EmailModule } from 'src/email/email.module';
// import { Repository } from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { UsersController } from 'src/users/users.controller';
// import { UsersService } from 'src/users/users.service';

import { TestingModule, Test } from '@nestjs/testing';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

// export type MockType<T> = {
//   [P in keyof T]?: jest.Mock<object>;
// };

// export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
//   () => ({
//     findOne: jest.fn((entity) => entity),
//     // ...
//   }),
// );

// describe('UsersController', () => {
//   let usersController: UsersController;
//   let usersService: UsersService;
//   let repositoryMock: MockType<Repository<User>>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [EmailModule],
//       controllers: [UsersController],
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useFactory: repositoryMockFactory,
//         },
//       ],
//     }).compile();

//     usersService = module.get<UsersService>(UsersService);
//     usersController = module.get<UsersController>(UsersController);
//   });

//   it('should be defined', () => {
//     expect(usersController).toBeDefined();
//   });
// });

const createUserDto: CreateUserDto = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  email: 'test@email.com',
  password: '123456',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ id: '1', ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: 'firstName #1',
                lastName: 'lastName #1',
              },
              {
                firstName: 'firstName #2',
                lastName: 'lastName #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a user', () => {
      usersController.create(createUserDto);
      expect(usersController.create(createUserDto)).resolves.toEqual({
        id: '1',
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should find all users ', () => {
      usersController.findAll();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a user', () => {
      expect(usersController.findOne(1)).resolves.toEqual({
        firstName: 'firstName #1',
        lastName: 'lastName #1',
        id: 1,
      });
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });

  // describe('remove()', () => {
  //   it('should remove the user', () => {
  //     usersController.remove(2, {
  //       id: 2,
  //     });
  //     expect(usersService.remove).toHaveBeenCalled();
  //   });
  // });
});
