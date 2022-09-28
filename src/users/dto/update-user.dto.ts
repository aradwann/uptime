/** NOTE
 * import from swagger should map the optional type DTO automatically into swagger documentation
 * BUT it doesn't work as expected
 */
// import { PartialType } from '@nestjs/swagger';

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
