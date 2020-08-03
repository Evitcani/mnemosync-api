import * as OktaJwtVerifier from "@okta/jwt-verifier";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";

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

    public get() {
        return this.oktaJwtVerifier;
    }
}