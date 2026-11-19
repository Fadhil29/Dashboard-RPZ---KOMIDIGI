// JANGAN DIUBAH. Memastikan login tiap role berhasil dan session tersimpan di .auth/
// Login-nya sendiri dijalankan oleh config/globalSetup.js sebelum test ini.
import { test, expect } from '@playwright/test';
import fs from 'fs';
import { ROLES, authFile } from '../../config/roles.js';

for (const role of ROLES) {
  test(`session login ${role} tersimpan`, async () => {
    expect(fs.existsSync(authFile(role))).toBeTruthy();
  });
}
