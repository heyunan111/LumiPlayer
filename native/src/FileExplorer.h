#pragma once

#include <napi.h>


namespace FileExplorer {
    
void Init(Napi::Env env, Napi::Object exports);

Napi::String openFileDialog(const Napi::CallbackInfo &info);

}