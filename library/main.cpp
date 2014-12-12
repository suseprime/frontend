#include <iostream>

#include "Modulo.h"
#include "KeyPair.h"
#include "HashKeys.h"
#include "Secret.h"

#include <cryptopp/aes.h>
#include <cryptopp/filters.h>
#include <cryptopp/modes.h>
#include <cryptopp/osrng.h>
#include <cryptopp/hex.h>
#include <cryptopp/integer.h>
#include <cryptopp/nbtheory.h>
#include <cryptopp/sha3.h>
#include <time.h>

using namespace std;


string hexEncodedByteArray(byte* arr) {
    string encoded;

    CryptoPP::StringSource(arr, sizeof(arr), true,
        new CryptoPP::HexEncoder(
            new CryptoPP::StringSink(encoded)
        )
    );

    return encoded;
}

string hexEncodedString(string str) {
    string encoded;

    CryptoPP::StringSource(str, true,
            new CryptoPP::HexEncoder(
                    new CryptoPP::StringSink(encoded)
            )
    );

    return encoded;
}

string AESEncrypt(string msg, CryptoPP::SecByteBlock* key, CryptoPP::SecByteBlock* iv) {
    CryptoPP::CTR_Mode<CryptoPP::AES>::Encryption e;

    string r;

    e.SetKeyWithIV(*key, CryptoPP::AES::DEFAULT_KEYLENGTH, *iv);

    CryptoPP::StringSource(msg, true,
        new CryptoPP::StreamTransformationFilter(e,
            new CryptoPP::StringSink(r)
        )
    );

    return r;
}

string AESDecrypt(string msg, CryptoPP::SecByteBlock* key, CryptoPP::SecByteBlock* iv) {
    CryptoPP::CTR_Mode<CryptoPP::AES>::Decryption e;

    string r;

    e.SetKeyWithIV(*key, sizeof(*key), *iv);

    CryptoPP::StringSource(msg, true,
        new CryptoPP::StreamTransformationFilter(e,
            new CryptoPP::StringSink(r)
        )
    );

    return r;
}

int main() {
    time_t start = clock();
    CryptoPP::AutoSeededRandomPool rnd;

    CryptoPP::SecByteBlock bobIV(CryptoPP::AES::BLOCKSIZE);
    rnd.GenerateBlock(bobIV, CryptoPP::AES::BLOCKSIZE);

    CryptoPP::SecByteBlock aliceIV(CryptoPP::AES::BLOCKSIZE);
    rnd.GenerateBlock(aliceIV, CryptoPP::AES::BLOCKSIZE);

    KeyPair bobKeyPair;
    KeyPair aliceKeyPair;

    Secret bobSecret(&bobKeyPair, &aliceKeyPair);
    Secret aliceSecret(&aliceKeyPair, &bobKeyPair);

    HashKeys bobKeys(&bobSecret);
    HashKeys aliceKeys(&aliceSecret);

    CryptoPP::SecByteBlock bobR(16);
    rnd.GenerateBlock(bobR, 16);

    CryptoPP::SecByteBlock bobGXHash(CryptoPP::SHA3_512::DIGESTSIZE);
    CryptoPP::SHA3_512().CalculateDigest(bobGXHash, *bobKeyPair.GetPublicKeyBytes(), bobKeyPair.GetPublicKeyBytes()->SizeInBytes());

    string sbobGXAES = AESEncrypt(string(reinterpret_cast<char const *>(bobKeyPair.GetPublicKeyBytes()->data()), bobKeyPair.GetPublicKeyBytes()->size()), &bobR, &bobIV);
    CryptoPP::SecByteBlock bobGXAES(reinterpret_cast<const byte *>(sbobGXAES.data()), sbobGXAES.size());

    cout << "modulo:" << modulo << endl;

    cout << "bob private:" << *bobKeyPair.GetPrivateKey() << endl;
    cout << "bob public:" << *bobKeyPair.GetPublicKey() << endl;
    cout << "alice private:" << *aliceKeyPair.GetPrivateKey() << endl;
    cout << "alice public:" << *aliceKeyPair.GetPublicKey() << endl;
    cout << "bob secret:" << *bobSecret.GetInteger() << endl;
    cout << "alice secret:" << *aliceSecret.GetInteger() << endl;
    cout << "a c" << hexEncodedByteArray(aliceKeys.GetC()->data()) << endl;
    cout << "b c" << hexEncodedByteArray(bobKeys.GetC()->data()) << endl;
    cout << "final:" << (double)(clock() - start) / CLOCKS_PER_SEC << endl;

    return 0;
}
