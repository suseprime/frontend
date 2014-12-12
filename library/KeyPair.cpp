#include "KeyPair.h"

#include "Modulo.h"

#include <cryptopp/nbtheory.h>

KeyPair::KeyPair() {
    CryptoPP::AutoSeededRandomPool rnd;

    _private = *(new CryptoPP::SecByteBlock(40));
    rnd.GenerateBlock(_private, 40);
    _privateInteger = *(new CryptoPP::Integer(_private, 40));

    _publicInteger = CryptoPP::ModularExponentiation(CryptoPP::Integer::Two(), _privateInteger, modulo);
    _public = *(new CryptoPP::SecByteBlock(_publicInteger.ByteCount()));
    _publicInteger.Encode(_public, sizeof(_public));
}

KeyPair::KeyPair(CryptoPP::SecByteBlock pub) {
    _public = pub;
    _publicInteger = *(new CryptoPP::Integer(_public, 40));
}

const CryptoPP::Integer* KeyPair::GetPrivateKey() {
    return &_privateInteger;
}

const CryptoPP::Integer* KeyPair::GetPublicKey() {
    return &_publicInteger;
}

const CryptoPP::SecByteBlock* KeyPair::GetPrivateKeyBytes() {
    return &_private;
}

const CryptoPP::SecByteBlock* KeyPair::GetPublicKeyBytes() {
    return &_public;
}
