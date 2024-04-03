const vcjs = require('@digitalcredentials/vc');
const {getProofPurpose, getSuite, documentLoader} = require("./utils");
const {SUNBIRD_VC} = require("./constants");

async function verifyCredential(verifiableCredential){

  if(!verifiableCredential){
    verifiableCredential= SUNBIRD_VC;
  }

  const purpose = getProofPurpose(verifiableCredential);
  const suite  = await getSuite(verifiableCredential);

  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: await documentLoader,
  };

  const result = await vcjs.verifyCredential(vcjsOptions);
  console.log("Result =>", result);
  return result;

}
verifyCredential();

module.exports = {verifyCredential}

