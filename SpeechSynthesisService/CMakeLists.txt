cmake_minimum_required(VERSION 3.5)
project(SpeechSynthesisService)

set(CMAKE_CXX_STANDARD 11)

file(GLOB SRC "src/*.cpp")
set(SOURCE_FILES SynthesisService.cpp espeak.h ${SRC})
add_executable(SpeechSynthesisService ${SOURCE_FILES})

include_directories(/usr/lib/x86_64-linux-gnu)
include_directories(/usr/lib)

find_library(ESPEAK libespeak.so.1)
find_library(POCONET libPocoNet.so.48)
target_link_libraries(SpeechSynthesisService ${ESPEAK} ${POCONET} amqpcpp PocoFoundation)