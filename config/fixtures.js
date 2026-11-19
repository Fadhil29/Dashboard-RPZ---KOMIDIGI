import fs from 'fs';
import { test as base, expect } from '@playwright/test';
import { authFile } from './roles.js';

export { expect };

// Memulihkan sessionStorage hasil login globalSetup ke setiap halaman baru.
// Nama role diambil dari nama project, misalnya "admin-chromium" -> "admin".
export const test = base.extend({
  context: async ({ context }, use, testInfo) => {
    const role = testInfo.project.name.split('-')[0];
    const file = authFile(role).replace(/\.json$/, '.session.json');

    if (fs.existsSync(file)) {
      const session = JSON.parse(fs.readFileSync(file, 'utf8'));
      await context.addInitScript((s) => {
        if (location.hostname !== s.host) return;
        for (const [k, v] of Object.entries(s.items)) {
          if (sessionStorage.getItem(k) === null) sessionStorage.setItem(k, v);
        }
      }, session);
    }

    await use(context);
  },
});