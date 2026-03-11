#include "hello.h"
#include <string>

namespace Hello {

// Hello World 函数实现
Napi::String SayHello(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello from C++!");
}

// 带参数的问候函数
Napi::String Greet(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  // 检查参数
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return Napi::String::New(env, "");
  }

  // 获取参数
  std::string name = info[0].As<Napi::String>().Utf8Value();
  std::string greeting = "Hello, " + name + " from C++!";

  return Napi::String::New(env, greeting);
}

// 加法函数
Napi::Number Add(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  // 检查参数
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Two numbers expected")
        .ThrowAsJavaScriptException();
    return Napi::Number::New(env, 0);
  }

  // 获取参数并计算
  double a = info[0].As<Napi::Number>().DoubleValue();
  double b = info[1].As<Napi::Number>().DoubleValue();
  double result = a + b;

  return Napi::Number::New(env, result);
}

// 注册所有函数
void Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "sayHello"),
              Napi::Function::New(env, SayHello));

  exports.Set(Napi::String::New(env, "greet"), Napi::Function::New(env, Greet));

  exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
}

} // namespace Hello
