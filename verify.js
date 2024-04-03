const vcjs = require('@digitalcredentials/vc');
const {getProofPurpose, getSuite, documentLoader} = require("./utils");
const jsonld = require("@digitalcredentials/jsonld");

// async function verify(){
//   console.log("\n\n  ************ Verification Initiated ************ \n")
//   let vcFilePath = "VC/vc.json";
//   if(process.argv.length > 1){
//     vcFilePath = process.argv[1];
//   }
//
//   const verifiableCredential = readFile(vcFilePath);
//   const result =  await verifyCredential(verifiableCredential);
//
//   if(!result.verified){
//     throw new Error("Verification Failed");
//   }
//
//   console.log("\nVerify Credential Response => ", JSON.stringify(result, null, 4));
//
//   console.log("\n\n  ************ Verification Completed ************ \n\n")
// }

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

