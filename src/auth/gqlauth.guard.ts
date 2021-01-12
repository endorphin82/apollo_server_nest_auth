import {ArgumentsHost, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {AuthGuard} from '@nestjs/passport';
import {ExecutionContextHost} from '@nestjs/core/helpers/execution-context-host';
import {Observable} from 'rxjs';
import {OAuth2Service} from './oauth2/oauth2.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {

  constructor(private readonly oauth2: OAuth2Service) { }

  canActivate(
      context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getArgByIndex(3).operation.operation !== 'subscription') {
      return this.oauth2.validate(GqlExecutionContext.create(context).getContext().req.headers.authorization
          .replace('Bearer ', ''));
    }
    return true;
  }

}
