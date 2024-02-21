const vcjs = require('@digitalcredentials/vc');
const { RsaSignature2018 } = require('./lib/jsonld-signatures/suites/rsa2018/RsaSignature2018');
const { AssertionProofPurpose } = require('./lib/jsonld-signatures/purposes/AssertionProofPurpose.js');
const {readFile} = require("./utils");
const jsonld = require("@digitalcredentials/jsonld");

async function verifyCredential(){
  console.log("\n\n  ************ Verification Initiated ************ \n")

  const verifiableCredential = readFile();
  const suiteOptions = {
    verificationMethod: verifiableCredential.proof.verificationMethod,
    date: verifiableCredential.proof.created,
  };

  const purpose = new AssertionProofPurpose();
  const suite  = new RsaSignature2018(suiteOptions);
  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: jsonld.documentLoaders.node(),
  };

  const result = await vcjs.verifyCredential(vcjsOptions);

  // console.log("\nVerify Credential Response => ", JSON.stringify(result, null, 4));
  console.log("\n  Verification Result => ", result.verified);
  console.log("\n\n  ************ Verification Completed ************ \n\n")
}

module.exports = {verifyCredential}
