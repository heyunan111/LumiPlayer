#include "hello.h"
#include <napi.h>


// 初始化模块，自动注册所有导出的函数
Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  // 注册 hello 模块的函数
  Hello::Init(env, exports);

  // 未来添加新模块时，在这里注册即可
  // YourNewModule::Init(env, exports);

  return exports;
}

// Node.js 模块入口
NODE_API_MODULE(addon, InitAll)
