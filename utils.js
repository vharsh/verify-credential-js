var fs = require('file-system');
const {AssertionProofPurpose} = require("./lib/jsonld-signatures/purposes/AssertionProofPurpose");
const {PublicKeyProofPurpose} = require("./lib/jsonld-signatures/purposes/PublicKeyProofPurpose");
const {RsaSignature2018} = require("./lib/jsonld-signatures/suites/rsa2018/RsaSignature2018");
const {Ed25519Signature2018} = require("./lib/jsonld-signatures/suites/ed255192018/Ed25519Signature2018");
const readFile = () => {
    const filesRead = fs.readFileSync("VC/vc.json");
    return JSON.parse(filesRead.toString());
}

const ProofType = {
    ED25519: 'Ed25519Signature2018',
    RSA: 'RsaSignature2018',
};

const ProofPurpose = {
    Assertion: 'assertionMethod',
    PublicKey: 'publicKey',
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

const getSuite = (verifiableCredential) => {
    let suite ;
    switch (verifiableCredential.proof.type) {
        case ProofType.RSA: {
            const suiteOptions = {
                verificationMethod: verifiableCredential.proof.verificationMethod,
                date: verifiableCredential.proof.created,
            };
            suite = new RsaSignature2018(suiteOptions);
            break;
        }
        case ProofType.ED25519: {
            const suiteOptions = {
                verificationMethod: verifiableCredential.proof.verificationMethod,
                date: verifiableCredential.proof.created,
            };
            suite = new Ed25519Signature2018(suiteOptions);
            break;
        }
    }
    return suite;
}

module.exports = {readFile, getProofPurpose, getSuite}
