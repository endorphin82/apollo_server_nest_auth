import { Module } from '@nestjs/common';
import {AuthModule} from '../../auth/auth.module';
import {SearchResolvers} from './search.resolvers';

@Module({
    imports:    [AuthModule],
    providers:  [SearchResolvers],
    exports: [SearchResolvers],
})
export class SearchModule {}
