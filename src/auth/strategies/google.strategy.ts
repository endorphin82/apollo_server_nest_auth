import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {OAuth2Service} from '../oauth2/oauth2.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly oauth2: OAuth2Service) {
        super(oauth2.getConfig());
    }
}
