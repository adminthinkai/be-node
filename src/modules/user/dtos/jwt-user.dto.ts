import { User } from "../../../models/entities";

export class JwtUserDto {
  id: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}
