import {Inject, Injectable} from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
// import {OAuth2Service} from './auth/oauth2/oauth2.service';
import * as GraphQLJSON from 'graphql-type-json';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {

    setContainer(container: any) {
        // useContainer(container);
    }

    async createGqlOptions(): Promise<GqlModuleOptions> {

        return {
            typePaths: ['./**/*.graphql'],
            installSubscriptionHandlers: true,
            context: ({ req }) => ({ req }),
            resolvers: { JSON: GraphQLJSON },
            subscriptions: {
            onConnect: async (connectionParams: any, websocket, context) => {
              // await this.oauth2.verify(connectionParams.authorization);
              console.log(connectionParams.authorization);
            },
            },
            // debug: this.config._isDev(),
            // playground: this.config._isDev(),
            // schema,
        };
    }
}
