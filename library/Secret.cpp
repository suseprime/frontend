#include "Secret.h"

#include <iostream>
#include <cryptopp/nbtheory.h>

#include "Modulo.h"

Secret::Secret(KeyPair* ours, KeyPair* theirs) {
    _integer = CryptoPP::ModularExponentiation(*theirs->GetPublicKey(), *ours->GetPrivateKey(), modulo);
    _data = *(new CryptoPP::SecByteBlock(_integer.ByteCount()));
    _integer.Encode(_data, sizeof(_data));
}

const CryptoPP::SecByteBlock* Secret::GetBytes() {
    return &_data;
}

const CryptoPP::Integer* Secret::GetInteger() {
    return &_integer;
}
