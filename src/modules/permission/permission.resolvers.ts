import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/gqlauth.guard';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Permission} from './permission.entity';
import {PubSub} from 'graphql-subscriptions';
import {RoleResolvers} from '../role/role.resolvers';

const pubSub = new PubSub();

@Resolver('Permission')
@UseGuards(GqlAuthGuard)
export class PermissionResolvers {

  constructor(
      @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
      private readonly roleResolvers: RoleResolvers,
  ) { }

  @Query()
  async getPermissions() {
    return await this.permissionRepository.find();
  }

  @Mutation('createPermission')
  async create(@Args('createPermissionInput') args: any): Promise<Permission> {
    const createdPermission = await this.permissionRepository.save({...args});
    await pubSub.publish('permissionCreated', { permissionChanged: Object.assign(createdPermission, {status: 'CREATED'})});
    return createdPermission;
  }

  @Mutation('updatePermission')
  async update(@Args('updatePermissionInput') args: any): Promise<Permission> {
    await this.permissionRepository.createQueryBuilder()
        .update(Permission)
        .set({...args})
        .where('id = :id', { id: args.id })
        .execute();

    const updatedPermission = await this.permissionRepository.findOneOrFail(args.id, { relations: ['roles'] });

    // Notify roles of permission changes
    (await updatedPermission.roles).map(async obj => await this.roleResolvers.update({ id: obj.id }));

    await pubSub.publish('permissionUpdated', { permissionChanged: Object.assign(updatedPermission, {status: 'UPDATED'})});
    return {...args};
  }

  @Mutation('removePermission')
  async remove(@Args('permissionId') permissionId: string | number): Promise<any> {
    await pubSub.publish('permissionDeleted', { permissionChanged: { id: permissionId, status: 'DELETED'} });
    return await this.permissionRepository.delete(permissionId);
  }

  @Subscription('permissionChanged')
  permissionChanged() {
    return pubSub.asyncIterator(['permissionCreated', 'permissionUpdated', 'permissionDeleted']);
  }
}
