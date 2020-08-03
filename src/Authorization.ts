import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import * as OktaJwtVerifier from "@okta/jwt-verifier";

@injectable()
export class Authorization {
    private readonly oktaJwtVerifier;

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