import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import {ConfigModule} from '../config/config.module';
import {AuthModule} from '../auth/auth.module';
import {OAuth2Service} from '../auth/oauth2/oauth2.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), ConfigModule, AuthModule],
  providers: [PhotoService, OAuth2Service],
  controllers: [PhotoController],
})
export class PhotoModule {}
