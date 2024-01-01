import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from 'src/common/interfaces/request-with-user.interface';
import { ROLES } from 'src/configs/constants';

const RoleGuard = (role: ROLES): Type<CanActivate> => {
  console.log({ role });
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.roles.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
