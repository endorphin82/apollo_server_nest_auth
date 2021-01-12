import {Body, Controller, Post, Req} from '@nestjs/common';
import {Credentials} from 'google-auth-library';
import {OAuth2Service} from './oauth2/oauth2.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly oauth2: OAuth2Service) { }

    @Post('/google_callback')
    async callback(@Req() request, @Body() body): Promise<Credentials> {
        return await this.oauth2.getOAuthClient(body.code);
    }

}
