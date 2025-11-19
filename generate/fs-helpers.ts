import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

export const ensureDir = (path: string) =>
  mkdirSync(path, { recursive: true });

export const writeTextFile = (path: string, content: string) => {
  ensureDir(dirname(path));
  writeFileSync(path, content, 'utf8');
};

export const readTextFile = (path: string): string =>
  readFileSync(path, 'utf8');

export const getHashOfString = (src: string): string =>
  createHash('sha256').update(src).digest('hex');

export const getExistingFileHash = (path: string): string | null =>
  existsSync(path) ? getHashOfString(readTextFile(path)) : null;

export const fileExists = (path: string): boolean =>
  existsSync(path);
