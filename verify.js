const vcjs = require('@digitalcredentials/vc');
const {getProofPurpose, getSuite, documentLoader} = require("./utils");

async function verifyCredential(verifiableCredential){

  const purpose = getProofPurpose(verifiableCredential);
  const suite  = await getSuite(verifiableCredential);

  const vcjsOptions = {
    purpose,
    suite,
    credential: verifiableCredential,
    documentLoader: await documentLoader,
  };

  return await vcjs.verifyCredential(vcjsOptions);

}


module.exports = {verifyCredential}

