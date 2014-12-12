# Suseprime

## Requirments
You need to have installed emscripten, cmake and c++ compiler.

##How to build

```
mkdir -pv builds/library-{c++,emscripten}
cd builds/library-c++
cmake ../../library
cd ../../
cd builds/library-emscripten
emcmake cmake ../../library -DCMAKE_BUILD_TYPE=Release
```

Release == -O2 + other optimilizations

Then just run make in builds/library-c++ for console build and builds/library-emscripten for browser build
