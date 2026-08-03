import * as bcrypt from 'bcryptjs';

export class PasswordUtil {
  private static readonly saltRounds = 12;
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
