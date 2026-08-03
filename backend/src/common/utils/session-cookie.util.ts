import * as crypto from 'node:crypto';

export class SessionCookieUtil {
  private static get secret(): string {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error('SESSION_SECRET is not set');
    }

    return secret;
  }

  static encrypt(id: string): string {
    const sig = crypto.createHmac('sha256', this.secret).update(id).digest('base64url').slice(0, 16);

    return Buffer.from(`${id}.${sig}`).toString('base64url');
  }

  static decrypt(data: string): string | null {
    try {
      const decoded = Buffer.from(data, 'base64url').toString();
      const separator = decoded.lastIndexOf('.');

      if (separator <= 0) return null;

      const id = decoded.slice(0, separator);
      const sig = decoded.slice(separator + 1);

      const expected = crypto.createHmac('sha256', this.secret).update(id).digest('base64url').slice(0, 16);

      if (sig.length !== expected.length) return null;

      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? id : null;
    } catch {
      return null;
    }
  }
}
