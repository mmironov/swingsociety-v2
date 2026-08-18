import * as migration_20260818_153035_initial from './20260818_153035_initial';

export const migrations = [
  {
    up: migration_20260818_153035_initial.up,
    down: migration_20260818_153035_initial.down,
    name: '20260818_153035_initial'
  },
];
