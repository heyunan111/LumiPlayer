#include "FileExplorer.h"
#include <napi.h>

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  FileExplorer::Init(env, exports);
  return exports;
}

NODE_API_MODULE(addon, InitAll)
