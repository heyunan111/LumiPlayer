#include "Database.h"
#include <napi.h>

namespace DataBase {

// Storage 方法实现
int Storage::insert(const MediaFile &file) {
  db.replace(file);
  return 1;
}

void Storage::remove(const std::string &id) {
  using namespace sqlite_orm;
  db.remove_all<MediaFile>(where(c(&MediaFile::id) == id));
}

std::vector<MediaFile> Storage::getAll() { return db.get_all<MediaFile>(); }

// --- 转换函数 ---

// C++ struct → JS object
Napi::Object mediaFileToNapi(Napi::Env env, const MediaFile &file) {
  Napi::Object obj = Napi::Object::New(env);
  obj.Set("id", Napi::String::New(env, file.id));
  obj.Set("path", Napi::String::New(env, file.path));
  obj.Set("type", Napi::String::New(env, file.type));
  obj.Set("name", Napi::String::New(env, file.name));
  obj.Set("size", Napi::Number::New(env, file.size));
  obj.Set("duration", Napi::Number::New(env, file.duration));
  obj.Set("addedAt", Napi::Number::New(env, file.addedAt));
  return obj;
}

// JS object → C++ struct
MediaFile napiToMediaFile(const Napi::Object &obj) {
  MediaFile file;
  file.id = obj.Get("id").As<Napi::String>().Utf8Value();
  file.path = obj.Get("path").As<Napi::String>().Utf8Value();
  file.type = obj.Get("type").As<Napi::String>().Utf8Value();
  file.name = obj.Get("name").As<Napi::String>().Utf8Value();
  file.size = obj.Get("size").As<Napi::Number>().Int32Value();
  file.duration = obj.Get("duration").As<Napi::Number>().Int32Value();
  file.addedAt = obj.Get("addedAt").As<Napi::Number>().Int32Value();
  return file;
}

// --- Napi 导出函数 ---

// db.insert(mediaFile) → void
Napi::Value DbInsert(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsObject()) {
    Napi::TypeError::New(env, "Expected a MediaFile object").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  MediaFile file = napiToMediaFile(info[0].As<Napi::Object>());
  Storage::getInstance().insert(file);
  return env.Undefined();
}

// db.remove(id: string) → void
Napi::Value DbRemove(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1 || !info[0].IsString()) {
    Napi::TypeError::New(env, "Expected a string id").ThrowAsJavaScriptException();
    return env.Undefined();
  }
  std::string id = info[0].As<Napi::String>().Utf8Value();
  Storage::getInstance().remove(id);
  return env.Undefined();
}

// db.getAll() → MediaFile[]
Napi::Value DbGetAll(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  auto files = Storage::getInstance().getAll();
  Napi::Array result = Napi::Array::New(env, files.size());
  for (size_t i = 0; i < files.size(); i++) {
    result.Set(i, mediaFileToNapi(env, files[i]));
  }
  return result;
}

void Init(Napi::Env env, Napi::Object exports) {
  exports.Set("dbInsert", Napi::Function::New(env, DbInsert));
  exports.Set("dbRemove", Napi::Function::New(env, DbRemove));
  exports.Set("dbGetAll", Napi::Function::New(env, DbGetAll));
}

} // namespace DataBase
