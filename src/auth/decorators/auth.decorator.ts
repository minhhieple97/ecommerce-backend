import { createParamDecorator, ExecutionContext ,SetMetadata} from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/configs/constants';
import { UserDocument } from 'src/users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserDocument;
  },
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
