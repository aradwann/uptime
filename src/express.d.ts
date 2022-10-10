import 'express';

// TODO find a way to type user as in the User entity
declare global {
  namespace Express {
    import { User } from './users/entities/user.entity';
    interface Request {
      user: User;
    }
  }
}
