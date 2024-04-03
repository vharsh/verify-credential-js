# verify-credential-js

This is a standalone javascript library that does that verification of the credential using digitalbazaar and digitalCredential Library

### Ways to use the library

**1. Manual Usage :**

1. Clone the Repository
2. Install the Dependencies
> `npm i`

2. VerifiableCredential must be stored in the vc.json

3. To Run the application, use this command

> npm run verify

**2. Github Automation Usage :**

1. modify the vc.json with the latest vc.
2. goto -> actions -> Verify Crendential 
3. Run Workflow by giving title for the run.
4. See the result under the actions console.

## Suites Supported

1. RsaSignature2018
2. Ed25519Signature2018
3. Ed25519Signature2020
