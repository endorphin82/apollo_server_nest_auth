import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {OAuth2Service} from '../oauth2/oauth2.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly oauth2: OAuth2Service) {
        super();
    }

    async validate(token: string) {
        const user = await this.oauth2.verify(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
