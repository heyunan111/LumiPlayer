#include <windows.h>
#include <shobjidl.h>
#include <string>
#include <vector>
#include <iostream>
#include "FileExplorer.h"

namespace FileExplorer{

// 辅助函数：wstring 转 UTF-8 string
std::string WStringToUTF8(const std::wstring& wstr) {
    if (wstr.empty()) return std::string();
    int size = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, NULL, 0, NULL, NULL);
    std::string result(size - 1, 0);
    WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), -1, &result[0], size, NULL, NULL);
    return result;
}


void Init(Napi::Env env, Napi::Object exports){
  exports.Set(Napi::String::New(env, "openFileDialog"), Napi::Function::New(env, openFileDialog));
}

Napi::String openFileDialog(const Napi::CallbackInfo &info){
Napi::Env env = info.Env();
HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED | COINIT_DISABLE_OLE1DDE);
if (FAILED(hr)) return Napi::String::New(env,WStringToUTF8(L""));

IFileOpenDialog* pFileOpen;
hr = CoCreateInstance(CLSID_FileOpenDialog, NULL, CLSCTX_ALL,
    IID_IFileOpenDialog, reinterpret_cast<void**>(&pFileOpen));

if (SUCCEEDED(hr)) {
    // 设置文件类型过滤器（可选）
    COMDLG_FILTERSPEC rgSpec[] = {
        { L"视频文件", L"*.mp4;*.avi;*.mkv" },
        { L"音频文件", L"*.mp3;*.wav;*.flac" }
    };
    pFileOpen->SetFileTypes(ARRAYSIZE(rgSpec), rgSpec);

    // 显示对话框
    hr = pFileOpen->Show(NULL);

    if (SUCCEEDED(hr)) {
        IShellItem* pItem;
        hr = pFileOpen->GetResult(&pItem);
        if (SUCCEEDED(hr)) {
            PWSTR pszFilePath;
            hr = pItem->GetDisplayName(SIGDN_FILESYSPATH, &pszFilePath);

            if (SUCCEEDED(hr)) {
                std::wstring filePath(pszFilePath);
                CoTaskMemFree(pszFilePath);
                pItem->Release();
                pFileOpen->Release();
                CoUninitialize();
                return Napi::String::New(env,WStringToUTF8(filePath));
            }
            pItem->Release();
        }
    }
    pFileOpen->Release();
}
CoUninitialize();
return Napi::String::New(env,WStringToUTF8(L""));
}

}