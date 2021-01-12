import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../../auth/auth.module';
import {Role} from './role.entity';
import {RoleResolvers} from './role.resolvers';
import {UserModule} from '../user/user.module';

@Module({
    imports:    [TypeOrmModule.forFeature([Role]), AuthModule, UserModule],
    providers:  [RoleResolvers],
    exports:    [RoleResolvers],
})
export class RoleModule {}
