import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {Role} from './role.entity';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../../auth/gqlauth.guard';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {UserResolvers} from '../user/user.resolvers';

const pubSub = new PubSub();

@Resolver('Role')
@UseGuards(GqlAuthGuard)
export class RoleResolvers {

  constructor(
      @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
      private readonly userResolvers: UserResolvers,
  ) { }

  @Query()
  async getRoles() {
    return await this.roleRepository.find();
  }

  @Mutation('createRole')
  async create(@Args('createRoleInput') args: any): Promise<Role> {
    const createdRole = await this.roleRepository.save({...args});
    await pubSub.publish('roleCreated', { roleChanged: Object.assign( createdRole, {status: 'CREATED'} ) });
    return createdRole;
  }

  @Mutation('updateRole')
  async update(@Args('updateRoleInput') args: any): Promise<Role> {
    const role = {...args};
    delete role.permissions;
    await this.roleRepository.createQueryBuilder()
        .update(Role)
        .set(role)
        .where('id = :id', { id: role.id })
        .execute();
    const updatedRole = await this.roleRepository.findOneOrFail(role.id, { relations: ['permissions'] });

    if (args.permissions) {
      args.permissions.map( async obj => (await updatedRole.permissions).find(o => o.id === +obj.id )
          || await this.addPermissionToRole({roleId: updatedRole.id, permissionId: obj.id}));
    }

    // Notify users of role changes
    const usersToUpdate: any = await this.roleRepository.findOneOrFail(role.id, {relations: ['users']});
    (await usersToUpdate.users).map(async obj => await this.userResolvers.update({ id: obj.id }));

    await pubSub.publish('roleUpdated', { roleChanged: Object.assign( updatedRole, {status: 'UPDATED'} ) });
    return updatedRole;
  }

  @Mutation('removeRole')
  async remove(@Args('roleId') roleId: string | number): Promise<DeleteResult> {
    await pubSub.publish('roleDeleted', { roleChanged: { id: roleId, status: 'DELETED'} });
    return await this.roleRepository.delete(roleId);
  }

  @Mutation('addPermissionToRole')
  async addPermissionToRole(@Args('updateRoleInput') args: any): Promise<Role> {
    await this.roleRepository.createQueryBuilder()
        .relation( Role, 'permissions' )
        .of(await this.roleRepository.findOneOrFail(args.roleId))
        .add(args.permissionId);

    const updatedRole = await this.roleRepository.findOneOrFail(args.roleId, { relations: ['permissions'] });
    await pubSub.publish('roleUpdated', { roleChanged: Object.assign( updatedRole, {status: 'UPDATED'} ) });
    return updatedRole;
  }

  @Subscription('roleChanged')
  async roleChanged() {
    return pubSub.asyncIterator(['roleCreated', 'roleUpdated', 'roleDeleted']);
  }
}
