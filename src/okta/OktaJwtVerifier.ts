/*!
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

const jwksClient = require('jwks-rsa');
const nJwt = require('njwt');

export class OktaJwtVerifier {
    private clientId;
    private claimsToAssert;
    private jwksClient;
    private verifier;

    constructor(options = {}) {

        // TODO parameter validation
        // @ts-ignore
        this.clientId = options.clientId;
        // @ts-ignore
        this.claimsToAssert = options.assertClaims || null;
        // @ts-ignore
        this.jwksClient = jwksClient({
            // @ts-ignore
            jwksUri: options.issuer + '/v1/keys',
            cache: true,
            // @ts-ignore
            cacheMaxAge: options.cacheMaxAge || (60 * 60 * 1000),
            cacheMaxEntries: 3,
            // @ts-ignore
            jwksRequestsPerMinute: options.jwksRequestsPerMinute || 10,
            rateLimit: true
        });
        this.verifier = nJwt.createVerifier().setSigningAlgorithm('RS256').withKeyResolver((kid, cb) => {
            this.jwksClient.getSigningKey(kid, (err, key) => {
                cb(err, key && (key.publicKey || key.rsaPublicKey));
            });
        });
    }

    verifyAccessToken(accessTokenString) {
        console.log("Inside verifier...");
        return new Promise((resolve, reject) => {
            return this.verifier.verify(accessTokenString, (err, jwt) => {
                console.log(`Callback!`);
                if (err) {
                    console.log(`Rejected!`);
                    return reject(err);
                }
                jwt.claims = jwt.body;
                delete jwt.body;
                const errors = [];

                if (this.claimsToAssert != null) {
                    console.log(`Going through claims!`);
                    for (let claim of Object.keys(this.claimsToAssert)) {
                        console.log(`Claim!: ${claim}`);
                        const actualValue = jwt.claims[claim];
                        const expectedValue = this.claimsToAssert[claim];
                        if (actualValue !== expectedValue) {
                            errors.push(`claim '${claim}' value '${actualValue}' does not match expected value '${expectedValue}'`);
                        }
                    }
                    if (errors.length) {
                        console.log(`Rejected!!`);
                        return reject(new Error(errors.join(', ')));
                    }
                } else {
                    console.log("No claims to go through.")
                }

                console.log("Completed verification...");

                return Promise.resolve(jwt);
            });
        });
    }
}