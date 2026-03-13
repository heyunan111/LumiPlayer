{
    "targets": [
        {
            "target_name": "addon",
            "sources": [
                "src/addon.cc",
                "src/FileExplorer.cc",
                "src/Database.cc",
                "third_party/sqlite3/sqlite3.c",
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")",
                "third_party/sqlite3",
                "third_party/sqlite_orm",
            ],
            "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
            "msvs_settings": {"VCCLCompilerTool": {"ExceptionHandling": 1}},
        }
    ]
}
