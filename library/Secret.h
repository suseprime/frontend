#pragma once

#include "KeyPair.h"

#include <cryptopp/secblock.h>
#include <cryptopp/integer.h>

class Secret {
public:
    Secret(KeyPair* ours, KeyPair* theirs);

    const CryptoPP::SecByteBlock* GetBytes();
    const CryptoPP::Integer* GetInteger();

private:
    CryptoPP::SecByteBlock _data;
    CryptoPP::Integer _integer;
};
