import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../../auth/auth.module';
import {Permission} from './permission.entity';
import {PermissionResolvers} from './permission.resolvers';
import {RoleModule} from '../role/role.module';

@Module({
    imports:    [TypeOrmModule.forFeature([Permission]), AuthModule, RoleModule],
    providers:  [PermissionResolvers],
})
export class PermissionModule {}
