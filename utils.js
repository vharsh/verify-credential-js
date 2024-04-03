const {AssertionProofPurpose} = require("./lib/jsonld-signatures/purposes/AssertionProofPurpose");
const {PublicKeyProofPurpose} = require("./lib/jsonld-signatures/purposes/PublicKeyProofPurpose");
const {RsaSignature2018} = require("./lib/jsonld-signatures/suites/rsa2018/RsaSignature2018");
const {Ed25519Signature2018} = require("./lib/jsonld-signatures/suites/ed255192018/Ed25519Signature2018");
const {Resolver} = require("did-resolver");
const web = require("web-did-resolver");
const {Ed25519Signature2020} = require("@digitalbazaar/ed25519-signature-2020");
const {Ed25519VerificationKey2020} = require("@digitalcredentials/ed25519-verification-key-2020");

const ProofType  = {
    ED25519_Signature_2018: 'Ed25519Signature2018',
    ED25519_Signature_2020: 'Ed25519Signature2020',
    RSA_Signature_2018: 'RsaSignature2018',
};

const ProofPurpose = {
    Assertion: 'assertionMethod',
    PublicKey: 'publicKey',
};

const documentLoader = async url => {
    if (url.startsWith('did:web')) {
        const webResolver = web.getResolver();
        const resolver = new Resolver({...webResolver});
        const document = await resolver.resolve(url);
        return {
            contextUrl: null,
            documentUrl: url,
            document: document?.didDocument,
        };
    }
    if (url.startsWith('https://')) {
        const response = await fetch(url, "GET");
        const json = await response.json();
        return {
            contextUrl: null,
            documentUrl: url,
            document: json,
        };
    }
    return jsonld.documentLoaders.xhr(url);
};

const getProofPurpose = (verifiableCredential) => {

    let purpose ;
    switch (verifiableCredential.proof.proofPurpose) {
        case ProofPurpose.Assertion:
            purpose = new AssertionProofPurpose()
            break;
        case ProofPurpose.PublicKey:
            purpose = new PublicKeyProofPurpose()
            break;
    }
    return purpose;
}

const getSuite = async(verifiableCredential) => {
    let suite ;
    switch (verifiableCredential.proof.type) {
        case ProofType.RSA_Signature_2018: {
            const suiteOptions = {
                verificationMethod: verifiableCredential.proof.verificationMethod,
                date: verifiableCredential.proof.created,
            };
            suite = new RsaSignature2018(suiteOptions);
            break;
        }
        case ProofType.ED25519_Signature_2018: {
            const suiteOptions = {
                verificationMethod: verifiableCredential.proof.verificationMethod,
                date: verifiableCredential.proof.created,
            };
            suite = new Ed25519Signature2018(suiteOptions);
            break;
        }
        case ProofType.ED25519_Signature_2020: {
            let verificationMethod = verifiableCredential.proof.verificationMethod;
            const {document} = await documentLoader(verificationMethod);
            const suiteOptions = {
                key: await Ed25519VerificationKey2020.from(document.verificationMethod?.find(d => d.id === verificationMethod)),
                date: verifiableCredential.proof.created,
            };
            suite = new Ed25519Signature2020(suiteOptions);
            break;
        }
    }
    return suite;
}

module.exports = {readFile, getProofPurpose, getSuite, documentLoader}
