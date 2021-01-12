import {Module, UnauthorizedException} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import * as ormconfig from './ormconfig';
import {GqlModuleOptions, GraphQLModule} from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import * as GraphQLJSON from 'graphql-type-json';
import {PubSub} from 'graphql-subscriptions';
import {OAuth2Service} from './auth/oauth2/oauth2.service';
import {AuthModule} from './auth/auth.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    TypeOrmModule.forRoot( ormconfig ),
    CatsModule,
    GraphQLModule.forRootAsync({
      // useClass: GraphqlConfigService,
      inject: [OAuth2Service],
      imports: [AuthModule],
      useFactory: async (oauth2: OAuth2Service) => ({
        typePaths: ['./**/*.graphql'],
        installSubscriptionHandlers: true,
        context: ({ req }) => ({ req }),
        resolvers: { JSON: GraphQLJSON },
        subscriptions: {
          onConnect: async (connectionParams: any, websocket, context) => {
            const user = await oauth2.verify(connectionParams.authorization.replace('Bearer ', ''));
            if (!user) {
              throw new UnauthorizedException();
            }
            return true;
          },
        },
      }) as GqlModuleOptions,
    }),
    PhotoModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SearchModule,
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  controllers: [],
})
export class AppModule {  }
