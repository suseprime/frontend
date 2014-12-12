#include "HashKeys.h"

#include <cryptopp/sha3.h>

HashKeys::HashKeys(Secret* s)
    : _ssid(8)
    , _c(16)
    , _cp(16)
    , _m1(CryptoPP::SHA3_512::DIGESTSIZE)
    , _m2(CryptoPP::SHA3_512::DIGESTSIZE)
    , _m1p(CryptoPP::SHA3_512::DIGESTSIZE)
    , _m2p(CryptoPP::SHA3_512::DIGESTSIZE)
{
    CryptoPP::SecByteBlock tmpBlock = *s->GetBytes();
    CryptoPP::SecByteBlock resBlock(tmpBlock.SizeInBytes() + 5);
    byte* tmp = resBlock.BytePtr();

    tmp[1] = ((sizeof(tmpBlock) >> 24) & 0xFF);
    tmp[2] = ((sizeof(tmpBlock) >> 16) & 0xFF);
    tmp[3] = ((sizeof(tmpBlock) >> 8) & 0xFF);
    tmp[4] = (sizeof(tmpBlock) & 0xFF);

    std::copy(std::begin(tmpBlock), std::end(tmpBlock), tmp + 5);

    byte* tmpRes = new byte[CryptoPP::SHA3_512::DIGESTSIZE];
    tmp[0] = 0x00;
    CryptoPP::SHA3_512().CalculateDigest(tmpRes, tmp, sizeof(tmp));
    std::copy(tmpRes, tmpRes + 8, std::begin(_ssid));

    tmp[0] = 0x01;
    CryptoPP::SHA3_512().CalculateDigest(tmpRes, tmp, sizeof(tmp));
    std::copy(tmpRes, tmpRes + 16, std::begin(_c));
    std::copy(tmpRes + 16, tmpRes + 32, std::begin(_cp));

    tmp[0] = 0x02;
    CryptoPP::SHA3_512().CalculateDigest(_m1, tmp, sizeof(tmp));

    tmp[0] = 0x03;
    CryptoPP::SHA3_512().CalculateDigest(_m2, tmp, sizeof(tmp));

    tmp[0] = 0x04;
    CryptoPP::SHA3_512().CalculateDigest(_m1p, tmp, sizeof(tmp));

    tmp[0] = 0x05;
    CryptoPP::SHA3_512().CalculateDigest(_m2p, tmp, sizeof(tmp));
}

CryptoPP::SecByteBlock* HashKeys::GetSSID() {
    return &_ssid;
}

CryptoPP::SecByteBlock* HashKeys::GetC() {
    return &_c;
}

CryptoPP::SecByteBlock* HashKeys::GetCP() {
    return &_cp;
}

CryptoPP::SecByteBlock* HashKeys::GetM1() {
    return &_m1;
}

CryptoPP::SecByteBlock* HashKeys::GetM2() {
    return &_m2;
}

CryptoPP::SecByteBlock* HashKeys::GetM1P() {
    return &_m1p;
}

CryptoPP::SecByteBlock* HashKeys::GetM2P() {
    return &_m2p;
}
