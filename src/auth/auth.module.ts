import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { OAuth2Service } from './oauth2/oauth2.service';
import { authenticate } from 'passport';
import {PassportModule} from '@nestjs/passport';
import {GoogleStrategy} from './strategies/google.strategy';
import {HttpStrategy} from './strategies/http.strategy';
import {ConfigModule} from '../config/config.module';
import {GqlAuthGuard} from './gqlauth.guard';
import {AuthResolvers} from './auth.resolvers';
import { AuthController } from './auth.controller';

const passportModule = PassportModule.register({ defaultStrategy: 'bearer' });

@Module({
  imports: [
    passportModule,
    ConfigModule,
  ],
  providers: [OAuth2Service, GoogleStrategy, HttpStrategy, GqlAuthGuard, AuthResolvers],
  exports: [passportModule, OAuth2Service],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(authenticate('google', {
          session: true,
          scope: ['profile'],
        }))
        .forRoutes('token');
  }
}
