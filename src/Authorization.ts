import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {OktaJwtVerifier} from "./okta/OktaJwtVerifier";

@injectable()
export class Authorization {
    private readonly oktaJwtVerifier: OktaJwtVerifier;

    constructor(@inject(TYPES.ClientID) clientID: string,
                @inject(TYPES.Issuer) issuer: string) {
        this.oktaJwtVerifier = new OktaJwtVerifier({
            issuer: issuer,
            clientId: clientID
        });
    }

    public verify(token, expectedAudience) {
        return this.oktaJwtVerifier.verifyAccessToken(token);
    }
}