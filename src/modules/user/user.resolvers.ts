import {Request, UseGuards} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {GqlAuthGuard} from '../../auth/gqlauth.guard';
import {User} from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PubSub} from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver('User')
@UseGuards(GqlAuthGuard)
export class UserResolvers {

  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  @Query()
  async getUsers() {
    return await this.userRepository.find();
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: any): Promise<User> {
    const createdUser = await this.userRepository.save({...args});
    if (args.roles) {
      await Object.keys(args.roles).map(async k => await this.addRoleToUser(
          { userId: createdUser.id, roleId: args.roles[k].id}));
    }
    const newUser = await this.userRepository.findOneOrFail( createdUser.id, { relations: ['roles', 'roles.permissions'] });
    await pubSub.publish('userCreated', {  usersChanged: Object.assign( newUser, {status: 'CREATED'}) });
    return newUser;
  }

  @Mutation('updateUser')
  async update(@Args('updateUserInput') args: any): Promise<User> {
    const user = {...args};
    delete user.roles;
    await this.userRepository.createQueryBuilder()
        .update(User)
        .set(user)
        .where('id = :id', { id: user.id })
        .execute();
    const updatedUser = await this.userRepository.findOneOrFail(user.id, { relations: ['roles', 'roles.permissions'] });
    await pubSub.publish('userUpdated', { usersChanged: Object.assign( updatedUser, {status: 'UPDATED'}) });

    if (args.roles) {
      await args.roles.map( async obj => (await updatedUser.roles).find(o => o.id === +obj.id )
          || await this.addRoleToUser({userId: updatedUser.id, roleId: obj.id}));
    }
    return await this.userRepository.findOneOrFail(user.id, { relations: ['roles', 'roles.permissions'] });
  }

  @Mutation('removeUser')
  async remove(@Args('userId') userId: string | number): Promise<any> {
    await pubSub.publish('userUpdated', { usersChanged: { id: userId, status: 'DELETED'} });
    return await this.userRepository.delete(userId);
  }

  @Mutation('addRoleToUser')
  async addRoleToUser(@Args('updateUserInput') args: any): Promise<User> {
    await this.userRepository.createQueryBuilder()
        .relation( User, 'roles' )
        .of(await this.userRepository.findOneOrFail(args.userId))
        .add(args.roleId);

    const updatedUser = await this.userRepository.findOneOrFail(args.userId, { relations: ['roles', 'roles.permissions'] });
    await pubSub.publish('userUpdated', { usersChanged: Object.assign( updatedUser, {status: 'UPDATED'} ) });
    return updatedUser;
  }

  @Subscription('usersChanged')
  usersChanged(): AsyncIterator<User> {
    return pubSub.asyncIterator(['userCreated', 'userUpdated', 'userDeleted']);
  }

}
