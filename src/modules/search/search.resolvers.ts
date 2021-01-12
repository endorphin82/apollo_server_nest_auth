import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/gqlauth.guard';
import {getRepository} from 'typeorm';

// const pubSub = new PubSub();

@Resolver('Search')
@UseGuards(GqlAuthGuard)
export class SearchResolvers {

  // constructor() {}

  @Query()
  async search(@Args('searchInput') args: any) {
    try {
      const repository = getRepository(args.type);
      const qb = repository.createQueryBuilder(args.type);

      const concat = [];
      // tslint:disable-next-line:forin
      for (const keyField in args.fields) {
        concat.push('"' + args.type + '"."' + args.fields[keyField] + '"');
        qb.addOrderBy(args.type + '.' + args.fields[keyField], 'ASC', 'NULLS LAST');
      }
      qb.where('CONCAT(' + concat.join(',\' \',') + ') ILIKE :value');
      qb.limit(5);
      switch (args.position) {
        case 'start': {
          await qb.setParameter('value', `${args.value}%`);
          break;
        }
        case 'end': {
          await qb.setParameter('value', `%${args.value}`);
          break;
        }
        default: {
          await qb.setParameter('value', `%${args.value}%`);
          break;
        }
      }

      return await qb.getMany();
    } catch (error) {
      return error;
    }
  }
}
