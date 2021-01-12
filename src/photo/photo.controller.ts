import {Body, Controller, Get, Options, Post, Req, UseGuards} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from './photo.entity';
import {ConfigService} from '../config/config.service';
import {AuthGuard} from '@nestjs/passport';

@Controller('photo')
@UseGuards(AuthGuard())
export class PhotoController {
  constructor(
      private readonly photoService: PhotoService,
      private readonly config: ConfigService,
  ) {}

  @Get()
  findAll(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get('protected')
  protected(): string {
    return `This is protected`;
  }

  @Get('/test')
  test(): string {
    return this.config.get('DATABASE_USER');
  }
}
