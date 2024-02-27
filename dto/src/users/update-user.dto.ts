import { createUserDto } from "./create-user.dto";

export type UpdateUserDto = {
  email?: string;
  name?: string;
  password?: string;
}

export const updateUserDto = createUserDto.partial();
