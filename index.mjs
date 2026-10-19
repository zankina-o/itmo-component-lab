// Компонент анализа файловой системы.
// Вход:  каталог /data (bind mount, только чтение).
// Выход: одна строка в stdout — ISU-FILES-DIRECTORIES-SIZE.
//
// Считаются рекурсивно: обычные файлы, каталоги (сам /data не считается)
// и суммарный размер обычных файлов в байтах. Символические ссылки
// и прочие специальные файлы пропускаются.

import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ISU = '507583'; // шестизначный табельный номер в ИСУ
const ROOT = process.env.DATA_DIR || '/data'; // переопределение только для локальной отладки

async function analyze(root) {
  const total = { files: 0, directories: 0, size: 0 };
  const queue = [root];

  while (queue.length > 0) {
    const dir = queue.pop();
    let names;
    try {
      names = await readdir(dir);
    } catch (err) {
      console.error(`Не удалось прочитать каталог ${dir}: ${err.message}`);
      continue;
    }

    for (const name of names) {
      const path = join(dir, name);
      let stats;
      try {
        // lstat, а не stat: символическая ссылка не разыменовывается.
        stats = await lstat(path);
      } catch (err) {
        console.error(`Не удалось получить сведения о ${path}: ${err.message}`);
        continue;
      }

      if (stats.isDirectory()) {
        total.directories++;
        queue.push(path);
      } else if (stats.isFile()) {
        total.files++;
        total.size += stats.size;
      }
    }
  }

  return total;
}

const { files, directories, size } = await analyze(ROOT);
process.stdout.write(`${ISU}-${files}-${directories}-${size}\n`);
