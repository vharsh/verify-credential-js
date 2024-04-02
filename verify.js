const vcjs = require('@digitalcredentials/vc');
const {readFile, getProofPurpose, getSuite, documentLoader} = require("./utils");
const jsonld = require("@digitalcredentials/jsonld");

async function verifyCredential(){
  console.log("\n\n  ************ Verification Initiated ************ \n")

  const verifiableCredential = readFile();
  const purpose = getProofPurpose(verifiableCredential);
  const suite  = await getSuite(verifiableCredential);

  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: await documentLoader,
  };

  const result = await vcjs.verifyCredential(vcjsOptions);

  console.log("\nVerify Credential Response => ", JSON.stringify(result, null, 4));
  console.log("\n  Verification Result => ", result.verified);
  console.log("\n\n  ************ Verification Completed ************ \n\n")
}


module.exports = {verifyCredential}

