#ifndef HELLO_H
#define HELLO_H

#include <napi.h>

namespace Hello {
// 初始化函数，注册所有导出
void Init(Napi::Env env, Napi::Object exports);

// Hello World 函数
Napi::String SayHello(const Napi::CallbackInfo &info);

// 带参数的函数示例
Napi::String Greet(const Napi::CallbackInfo &info);

// 返回数字的函数示例
Napi::Number Add(const Napi::CallbackInfo &info);
} // namespace Hello

#endif // HELLO_H
