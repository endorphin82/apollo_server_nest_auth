import { Module } from '@nestjs/common';
import { CatsResolvers } from './cats.resolvers';
import { CatsService } from './cats.service';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CatsService, CatsResolvers],
})
export class CatsModule {}
