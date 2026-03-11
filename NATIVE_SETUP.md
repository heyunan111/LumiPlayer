# C++ Native Addon 快速开始

## 🚀 首次构建

```bash
# 1. 进入 native 目录
cd native

# 2. 安装依赖
npm install

# 3. 编译 C++ 代码
npm run build

# 4. 返回项目根目录
cd ..

# 5. 启动项目
npm run dev
```

## ✅ 验证

启动后，在 FileExplorer 组件中会看到：
- `sayHello()`: Hello from C++!
- `greet('LumiPlayer')`: Hello, LumiPlayer from C++!
- `add(42, 58)`: 100

## 📁 项目结构

```
LumiPlayer/
├── native/                          # C++ Native Addon
│   ├── CMakeLists.txt              # CMake 配置（自动扫描）
│   ├── package.json                # Native 模块配置
│   ├── src/                        # C++ 源代码
│   │   ├── addon.cc               # 模块入口
│   │   ├── hello.h                # Hello 模块头文件
│   │   └── hello.cc               # Hello 模块实现
│   └── build/                      # 编译输出（自动生成）
│       └── Release/
│           └── addon.node         # 编译后的模块
│
├── apps/
│   ├── electron-main/
│   │   └── ipc/
│   │       └── nativeIpc.ts       # IPC 桥接
│   └── renderer/
│       └── src/
│           └── api/
│               └── native.ts       # 渲染进程 API
```

## 🔧 添加新的 C++ 功能

### 1. 创建新模块

在 `native/src/` 创建新文件：

**math.h**
```cpp
#ifndef MATH_H
#define MATH_H

#include <napi.h>

namespace Math {
    void Init(Napi::Env env, Napi::Object exports);
    Napi::Number Multiply(const Napi::CallbackInfo& info);
}

#endif
```

**math.cc**
```cpp
#include "math.h"

namespace Math {

Napi::Number Multiply(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    double a = info[0].As<Napi::Number>().DoubleValue();
    double b = info[1].As<Napi::Number>().DoubleValue();
    return Napi::Number::New(env, a * b);
}

void Init(Napi::Env env, Napi::Object exports) {
    exports.Set("multiply", Napi::Function::New(env, Multiply));
}

} // namespace Math
```

### 2. 在 addon.cc 中注册

```cpp
#include "math.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    Hello::Init(env, exports);
    Math::Init(env, exports);  // 添加这一行
    return exports;
}
```

### 3. 重新编译

```bash
cd native
npm run rebuild
```

就这么简单！CMake 会自动发现并编译新文件。

### 4. 在 IPC 中暴露

**apps/electron-main/ipc/nativeIpc.ts**
```typescript
ipcMain.handle('native:multiply', (_event, a: number, b: number) => {
    if (!addon) throw new Error('Native addon not loaded');
    return addon.multiply(a, b);
});
```

### 5. 在渲染进程中使用

**apps/renderer/src/api/native.ts**
```typescript
multiply: async (a: number, b: number): Promise<number> => {
    return await window.electron.ipcRenderer.invoke('native:multiply', a, b);
},
```

## 📦 添加第三方 C++ 库

在 `native/CMakeLists.txt` 中添加：

```cmake
# 查找库（例如 OpenCV）
find_package(OpenCV REQUIRED)

# 添加包含目录
target_include_directories(${PROJECT_NAME} PRIVATE 
    ${CMAKE_JS_INC}
    ${INCLUDE_DIRS}
    ${OpenCV_INCLUDE_DIRS}  # 添加这一行
)

# 链接库
target_link_libraries(${PROJECT_NAME} 
    ${CMAKE_JS_LIB}
    ${OpenCV_LIBS}  # 添加这一行
)
```

## 🛠️ 常用命令

```bash
# 编译
cd native && npm run build

# 重新编译
cd native && npm run rebuild

# 清理构建
cd native && npm run clean

# 完整构建（包含 native）
npm run build

# 仅重新编译 native
npm run rebuild:native
```

## ⚠️ 注意事项

1. **首次运行前必须编译 C++**
   ```bash
   cd native && npm install && npm run build
   ```

2. **修改 C++ 代码后需要重新编译**
   ```bash
   cd native && npm run rebuild
   ```

3. **Windows 需要安装 Visual Studio Build Tools**
   - 下载：https://visualstudio.microsoft.com/downloads/
   - 选择 "Desktop development with C++"

4. **Electron 版本变化时需要重新编译**
   ```bash
   npm install -D electron-rebuild
   npx electron-rebuild
   ```

## 🎯 示例：调用 C++ 函数

```typescript
import { nativeApi } from '@/api/native';

// 调用 C++ 函数
const result = await nativeApi.sayHello();
console.log(result); // "Hello from C++!"

const greeting = await nativeApi.greet('World');
console.log(greeting); // "Hello, World from C++!"

const sum = await nativeApi.add(10, 20);
console.log(sum); // 30
```

## 🐛 故障排除

### 问题：找不到 addon.node

**解决：**
```bash
cd native
npm install
npm run build
```

### 问题：编译失败

**检查：**
1. 是否安装了 Visual Studio Build Tools（Windows）
2. 是否安装了 cmake-js：`npm install -D cmake-js`
3. 是否安装了 node-addon-api：`cd native && npm install`

### 问题：运行时报错 "Native addon not loaded"

**解决：**
1. 确保已编译：`cd native && npm run build`
2. 检查路径是否正确
3. 查看控制台错误信息
