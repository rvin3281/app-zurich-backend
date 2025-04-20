import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USER_ROLE } from '../../enum';
import { ROLES_KEY } from '../decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // GET THE REQUIRED ROLES FROM THE ANNOTATOR
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const userRole = request.headers['x-api-roles']?.toLowerCase();

    // IF API DOESNT HAVE @ROLES THEN CAN ABLE TO ACCESS THE API
    if (!requiredRoles) return true;

    // IF THE API HAS @ROLES, THEN IF ROLES STATED NOT INCLUDED ROLES PROVIDED RETURN UNAUTHORIZED
    if (!userRole || !requiredRoles.includes(userRole as USER_ROLE)) {
      throw new UnauthorizedException('You are not authorized');
    }

    return true;
  }
}
