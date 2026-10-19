# Компонент анализа файловой системы в Docker

Программа на Node.js (`node:fs`) рекурсивно обходит каталог `/data` и выводит в stdout одну строку:

```
ISU-FILES-DIRECTORIES-SIZE
```

- `FILES` — количество обычных файлов;
- `DIRECTORIES` — количество каталогов (сам `/data` не считается, пустые подкаталоги считаются);
- `SIZE` — суммарный размер обычных файлов в байтах.

Символические ссылки и специальные файлы пропускаются. Каталог `/data` только читается.

## Сборка и запуск

```sh
docker build -t student-fs .
docker run --rm --network none \
  --mount type=bind,source="$(pwd)/test-data",target=/data,readonly \
  student-fs
```

## Локальная проверка без Docker

```sh
DATA_DIR=./test-data node index.mjs
```

## Публикация

При каждом push в `main` GitHub Actions ([.github/workflows/docker.yml](.github/workflows/docker.yml))
собирает образ (linux/amd64), проверяет контракт на тестовых каталогах и публикует его в GitHub Container Registry:

```
ghcr.io/zankina-o/itmo-component-lab:507583
```

Тег образа совпадает с номером ИСУ в первой части вывода.
