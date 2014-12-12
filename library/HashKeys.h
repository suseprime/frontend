#pragma once

#include <cryptopp/integer.h>

#include "Secret.h"

class HashKeys {
public:
    HashKeys(Secret* s);

    CryptoPP::SecByteBlock* GetSSID();
    CryptoPP::SecByteBlock* GetC();
    CryptoPP::SecByteBlock* GetCP();
    CryptoPP::SecByteBlock* GetM1();
    CryptoPP::SecByteBlock* GetM2();
    CryptoPP::SecByteBlock* GetM1P();
    CryptoPP::SecByteBlock* GetM2P();

private:
    CryptoPP::SecByteBlock _ssid;

    CryptoPP::SecByteBlock _c;
    CryptoPP::SecByteBlock _cp;
    CryptoPP::SecByteBlock _m1;
    CryptoPP::SecByteBlock _m2;
    CryptoPP::SecByteBlock _m1p;
    CryptoPP::SecByteBlock _m2p;
};
