#pragma once

#include <cryptopp/integer.h>
#include <cryptopp/osrng.h>

class KeyPair {
public:
    KeyPair();
    KeyPair(CryptoPP::SecByteBlock pub);

    const CryptoPP::Integer* GetPrivateKey();
    const CryptoPP::SecByteBlock* GetPrivateKeyBytes();

    const CryptoPP::Integer* GetPublicKey();
    const CryptoPP::SecByteBlock* GetPublicKeyBytes();

private:
    void Init();

    CryptoPP::SecByteBlock _private;
    CryptoPP::Integer _privateInteger;

    CryptoPP::SecByteBlock _public;
    CryptoPP::Integer _publicInteger;
};
