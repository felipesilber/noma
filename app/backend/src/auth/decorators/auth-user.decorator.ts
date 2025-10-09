import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<any>();
  return req.auth?.id as number;
});

export const AuthUser = createParamDecorator((_d, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<any>();
  return req.auth as { id: number; uid: string; email?: string | null };
});
