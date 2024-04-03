/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
const { Buffer } = require('buffer');
const forge = require('node-forge');
const pki = forge.pki;
const asn1 = forge.asn1;
const util = forge.util;
const random = forge.random;
const md = forge.md;


const privateKeyToAsn1 = pki.privateKeyToAsn1;
const publicKeyToAsn1 = pki.publicKeyToAsn1;
const privateKeyFromAsn1 = pki.privateKeyFromAsn1;
const publicKeyFromAsn1 = pki.publicKeyFromAsn1;
const toDer = asn1.toDer;
const fromDer = asn1.fromDer;
const createBuffer = util.createBuffer;
const getRandomBytes = random.getBytesSync;
const sha256 = md.sha256;
const ed25519 = pki.ed25519;

const publicKeyEncoding = { format: 'der', type: 'spki' };
const DER_PRIVATE_KEY_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const DER_PUBLIC_KEY_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

const api = {
  async generateKeyPairFromSeed(seedBytes) {
    const privateKey = forgePrivateKey(_privateKeyDerEncode({ seedBytes }));

    const publicKey = createForgePublicKeyFromPrivateKeyBuffer(privateKey);
    const publicKeyBuffer = Buffer.from(toDer(publicKeyToAsn1(publicKey)).getBytes(), 'binary');

    const publicKeyBytes = getKeyMaterial(publicKeyBuffer);
    return {
      publicKey: publicKeyBytes,
      secretKey: Buffer.concat([seedBytes, publicKeyBytes]),
    };
  },
  async generateKeyPair() {
    const seed = randomBytes(32);
    return api.generateKeyPairFromSeed(seed);
  },
  async sign(privateKeyBytes, data) {
    const privateKey = forgePrivateKey(_privateKeyDerEncode({ privateKeyBytes }));
    const signature = forgeSign(data, privateKey);

    return signature;
  },
  async verify(publicKeyBytes, data, signature) {
    const publicKey = await createForgePublicKeyFromPublicKeyBuffer(_publicKeyDerEncode({ publicKeyBytes }));
    return forgeVerifyEd25519(data, publicKey, signature);
  },
};

module.exports = api;

function forgePrivateKey(privateKeyBuffer) {
  return privateKeyFromAsn1(fromDer(privateKeyBuffer));
}

function fromDerFn(keyBuffer) {
  return forgeFromDer(keyBuffer.toString('binary'));
}

function createForgePublicKeyFromPrivateKeyBuffer(privateKeyObject) {
  const privateKeyBuffer = privateKeyToBuffer(privateKeyObject);
  const publicKey = ed25519.publicKeyFromPrivateKey({ privateKey: privateKeyBuffer });
  return publicKey;
}

function createForgePublicKeyFromPublicKeyBuffer(publicKeyBuffer) {
  const publicKeyObject = publicKeyFromAsn1(fromDerFn(publicKeyBuffer));
  const publicKeyDer = toDer(publicKeyToAsn1(publicKeyObject)).getBytes();

  return publicKeyDer;
}

function forgeSign(data, privateKeyObject) {
  const privateKeyBytes = toDer(privateKeyToAsn1(privateKeyObject)).getBytes();

  const privateKey = createBuffer(privateKeyBytes);

  const signature = ed25519.sign({
    privateKey,
    md: sha256.create(),
    message: data,
  });

  return signature.toString('binary');
}

function forgeVerifyEd25519(data, publicKey, signature) {
  return ed25519.verify({
    publicKey: publicKey,
    signature: createBuffer(signature),
    message: createBuffer(data),
  });
}

function randomBytes(length) {
  return Buffer.from(getRandomBytes(length), 'binary');
}

function privateKeyToBuffer(privateKey) {
  const privateKeyAsn1 = privateKeyToAsn1(privateKey);
  const privateKeyDer = toDer(privateKeyAsn1).getBytes();

  const privateKeyBuffer = Buffer.from(privateKeyDer, 'binary');

  return privateKeyBuffer;
}

function getKeyMaterial(buffer) {
  if (buffer.indexOf(DER_PUBLIC_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PUBLIC_KEY_PREFIX.length, buffer.length);
  }
  if (buffer.indexOf(DER_PRIVATE_KEY_PREFIX) === 0) {
    return buffer.slice(DER_PRIVATE_KEY_PREFIX.length, buffer.length);
  }
  throw new Error('Expected Buffer to match Ed25519 Public or Private Prefix');
}

function _privateKeyDerEncode({ privateKeyBytes, seedBytes }) {
  if (!(privateKeyBytes || seedBytes)) {
    throw new TypeError('`privateKeyBytes` or `seedBytes` is required.');
  }
  if (!privateKeyBytes && !(seedBytes instanceof Uint8Array && seedBytes.length === 32)) {
    throw new TypeError('`seedBytes` must be a 32 byte Buffer.');
  }
  if (!seedBytes && !(privateKeyBytes instanceof Uint8Array && privateKeyBytes.length === 64)) {
    throw new TypeError('`privateKeyBytes` must be a 64 byte Buffer.');
  }
  let p;
  if (seedBytes) {
    p = seedBytes;
  } else {
    p = privateKeyBytes.slice(0, 32);
  }
  return Buffer.concat([DER_PRIVATE_KEY_PREFIX, p]);
}

function _publicKeyDerEncode({ publicKeyBytes }) {
  if (!(publicKeyBytes instanceof Uint8Array && publicKeyBytes.length === 32)) {
    throw new TypeError('`publicKeyBytes` must be a 32 byte Buffer.');
  }
  return Buffer.concat([DER_PUBLIC_KEY_PREFIX, publicKeyBytes]);
}

module.export = {_publicKeyDerEncode,_privateKeyDerEncode }
