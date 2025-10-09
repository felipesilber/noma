import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { UserService } from '../user/user.service';
import { admin } from './firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private users: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<any>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const authHeader = req.headers?.authorization as string | undefined;
    const tokenMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
    const idToken = tokenMatch?.[1];

    if (!idToken) {
      throw new UnauthorizedException('Missing authorization token!');
    }

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      req.firebaseUser = decoded;

      let dbUser = await this.users.findByUid(decoded.uid);
      if (!dbUser) {
        dbUser = await this.users.createFromFirebase(
          decoded.uid,
          decoded.email ?? '',
          (decoded as any).name ?? '',
        );
      }

      req.user = dbUser;
      req.auth = {
        id: dbUser.id,
        uid: decoded.uid,
        email: decoded.email ?? null,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
