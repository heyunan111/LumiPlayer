cmake_minimum_required(VERSION 3.15)
project(lumiplayer_native)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 查找 node-addon-api
execute_process(
    COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
    OUTPUT_STRIP_TRAILING_WHITESPACE
)

# 移除可能的引号
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

# 自动查找所有 .cpp 和 .cc 文件
file(GLOB_RECURSE SOURCE_FILES 
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc"
)

# 自动查找所有头文件目录
file(GLOB_RECURSE HEADER_FILES 
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.h"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.hpp"
)

# 提取头文件所在的目录
set(INCLUDE_DIRS "")
foreach(HEADER ${HEADER_FILES})
    get_filename_component(DIR ${HEADER} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${DIR})
endforeach()
list(REMOVE_DUPLICATES INCLUDE_DIRS)

# Node.js Native Addon
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# 设置输出名称
set_target_properties(${PROJECT_NAME} PROPERTIES 
    PREFIX ""
    SUFFIX ".node"
    OUTPUT_NAME "addon"
)

# 包含 Node-API 头文件
target_include_directories(${PROJECT_NAME} PRIVATE 
    ${CMAKE_JS_INC}
    ${NODE_ADDON_API_DIR}
    ${INCLUDE_DIRS}
)

# 定义 NAPI 版本
target_compile_definitions(${PROJECT_NAME} PRIVATE 
    NAPI_VERSION=8
    NAPI_DISABLE_CPP_EXCEPTIONS
)

# 链接 Node.js 库
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# Windows + MinGW 特定配置
if(WIN32 AND MINGW)
    # 移除 MSVC 特定的链接标志
    set(CMAKE_SHARED_LINKER_FLAGS "")
    
    # 添加 MinGW 需要的标志
    target_link_options(${PROJECT_NAME} PRIVATE 
        -static-libgcc
        -static-libstdc++
    )
endif()

# 如果需要添加第三方库，在这里添加
# find_package(YourLibrary REQUIRED)
# target_link_libraries(${PROJECT_NAME} YourLibrary::YourLibrary)
