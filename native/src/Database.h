#pragma once

#include "../third_party/sqlite3/sqlite3.h"
#include "../third_party/sqlite_orm/sqlite_orm.h"
#include <napi.h>
#include <string>
#include <vector>

namespace DataBase {

struct MediaFile {
  std::string id;
  std::string path;
  std::string type;
  std::string name;
  int size;
  int duration;
  int addedAt;
};

inline auto makeStorage() {
  using namespace sqlite_orm;
  return make_storage(
      "lumiplayer.db",
      make_table("media_files",
                 make_column("id", &MediaFile::id, primary_key()),
                 make_column("path", &MediaFile::path),
                 make_column("type", &MediaFile::type),
                 make_column("name", &MediaFile::name),
                 make_column("size", &MediaFile::size),
                 make_column("duration", &MediaFile::duration),
                 make_column("addedAt", &MediaFile::addedAt)));
}

using StorageType = decltype(makeStorage());

class Storage {
private:
  StorageType db;

  Storage() : db(makeStorage()) { db.sync_schema(); }
  ~Storage() = default;

  Storage(const Storage &) = delete;
  Storage &operator=(const Storage &) = delete;

public:
  static Storage &getInstance() {
    static Storage instance;
    return instance;
  }

  int insert(const MediaFile &file);
  void remove(const std::string &id);
  std::vector<MediaFile> getAll();
};

void Init(Napi::Env env, Napi::Object exports);

} // namespace DataBase
