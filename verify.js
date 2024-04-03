const vcjs = require('@digitalcredentials/vc');
const {readFile, getProofPurpose, getSuite, documentLoader} = require("./utils");
const jsonld = require("@digitalcredentials/jsonld");

async function verifyCredential(){
  console.log("\n\n  ************ Verification Initiated ************ \n")
  let vcFilePath = "VC/vc.json";
  if(process.argv.length > 1){
    vcFilePath = process.argv[1];
  }

  const verifiableCredential = readFile(vcFilePath);
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

  if(!result.verified){
    throw new Error("Verification Failed");
  }
  console.log("\n\n  ************ Verification Completed ************ \n\n")
}


module.exports = {verifyCredential}

