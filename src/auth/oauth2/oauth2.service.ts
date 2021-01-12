import {Injectable, UnauthorizedException} from '@nestjs/common';
import {OAuth2Client} from 'google-auth-library';
import {GetTokenResponse} from 'google-auth-library/build/src/auth/oauth2client';
import {google} from 'googleapis';
import {ConfigService} from '../../config/config.service';

export interface IOAuthConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback: boolean;
}

@Injectable()
export class OAuth2Service {
    private readonly clientId: string = this.config.get('CLIENT_ID');
    private readonly clientSecret: string = this.config.get('CLIENT_SECRET');
    private readonly redirectUrl: string = this.config.get('CALLBACK_URL');

    private readonly oauth2Client: OAuth2Client;

    constructor(
        private readonly config: ConfigService,
    ) {
        this.oauth2Client = new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            this.redirectUrl,
        );
    }

    async getOAuthClient(code: string): Promise<any> {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            const userInfo = await this.getUserInfo(this.oauth2Client);
            return {...userInfo.data, id_token : tokens.id_token};
        } catch (e) {
            return e;
        }
    }

    getConfig(): IOAuthConfig {
        return {
            clientID: this.clientId,
            clientSecret: this.clientSecret,
            callbackURL: this.redirectUrl,
            passReqToCallback: true,
        };
    }

    async verify(token: string) {
        return await this.oauth2Client.verifyIdToken({
            idToken: token,
            audience: this.clientId,
        });
    }

    async getToken(code: string): Promise<GetTokenResponse> {
        return await this.oauth2Client.getToken(code);
    }

    async getUserInfo(client: any): Promise<object | any> {
        return await google.oauth2({
            auth: client,
            version: 'v2',
        }).userinfo.v2.me.get();
    }

    async validate(token: string): Promise<boolean> {
        try {
            await this.oauth2Client.verifyIdToken({
                idToken: token,
                audience: this.clientId,
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
