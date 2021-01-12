import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../../auth/auth.module';
import {User} from './user.entity';
import {UserResolvers} from './user.resolvers';

@Module({
    imports:    [TypeOrmModule.forFeature([User]), AuthModule],
    providers:  [UserResolvers],
    exports:    [UserResolvers],
})
export class UserModule {}
