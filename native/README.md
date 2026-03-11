# LumiPlayer Native C++ Addon

## 目录结构

```
native/
├── CMakeLists.txt          # CMake 配置（自动扫描所有 .cc/.cpp 文件）
├── package.json            # Native 模块配置
├── src/                    # C++ 源代码目录
│   ├── addon.cc           # 模块入口（注册所有导出）
│   ├── hello.h            # Hello 模块头文件
│   └── hello.cc           # Hello 模块实现
└── build/                  # 编译输出目录（自动生成）
```

## 添加新的 C++ 模块

### 1. 创建新模块文件

在 `src/` 目录下创建：
- `your_module.h` - 头文件
- `your_module.cc` - 实现文件

### 2. 在 addon.cc 中注册

```cpp
#include "your_module.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    Hello::Init(env, exports);
    YourModule::Init(env, exports);  // 添加这一行
    return exports;
}
```

### 3. 重新编译

```bash
cd native
npm run rebuild
```

就这么简单！CMake 会自动发现并编译新文件。

## 构建命令

```bash
cd native

# 安装依赖
npm install

# 首次编译
npm run build

# 重新编译
npm run rebuild

# 清理构建
npm run clean
```

## 在 Electron 中使用

```typescript
// 在主进程中
import path from 'path';
const addon = require(path.join(__dirname, '../native/build/Release/addon.node'));

// 通过 IPC 暴露给渲染进程
ipcMain.handle('native:sayHello', () => addon.sayHello());
```

## 添加第三方 C++ 库

在 `CMakeLists.txt` 中添加：

```cmake
# 查找库
find_package(YourLibrary REQUIRED)

# 链接库
target_link_libraries(${PROJECT_NAME} 
    ${CMAKE_JS_LIB}
    YourLibrary::YourLibrary
)
```
