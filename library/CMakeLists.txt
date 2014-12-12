cmake_minimum_required(VERSION 2.8.4)
project(sample_crypto)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_COLOR_MAKEFILE ON)

set(CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake/modules)

set(CMAKE_EXECUTABLE_SUFFIX ".html")

add_subdirectory(thirdparty/cryptopp)

include_directories(thirdparty)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp
                 KeyPair.cpp
                 HashKeys.cpp
                 Secret.cpp)

add_executable(sample_crypto ${SOURCE_FILES})

target_link_libraries(sample_crypto cryptopp)
