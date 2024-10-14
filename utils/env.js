import dotenv from 'dotenv';

dotenv.config();
const result = dotenv.config();

if (result.error) {
  console.error('Не вдалося завантажити файл .env', result.error);
}

export function env(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
