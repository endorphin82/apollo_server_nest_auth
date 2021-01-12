import { createParamDecorator } from '@nestjs/common';

export const CurentUser = createParamDecorator(
    (data, [root, args, ctx, info]) => ctx.req.user,
);
