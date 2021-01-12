import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {OAuth2Service} from './oauth2/oauth2.service';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly oauth2: OAuth2Service) {}

  @Mutation('login')
  async login( @Args('authUserInput') args: any ): Promise<any> {
    return await this.oauth2.getOAuthClient(args.code);
  }

  @Mutation('logout')
  logout(): any | void {
    return true;
  }

}
