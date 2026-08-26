import * as migration_20260818_153035_initial from './20260818_153035_initial';
import * as migration_20260820_075735_embed_block from './20260820_075735_embed_block';
import * as migration_20260826_150251_section_pages from './20260826_150251_section_pages';

export const migrations = [
  {
    up: migration_20260818_153035_initial.up,
    down: migration_20260818_153035_initial.down,
    name: '20260818_153035_initial',
  },
  {
    up: migration_20260820_075735_embed_block.up,
    down: migration_20260820_075735_embed_block.down,
    name: '20260820_075735_embed_block',
  },
  {
    up: migration_20260826_150251_section_pages.up,
    down: migration_20260826_150251_section_pages.down,
    name: '20260826_150251_section_pages'
  },
];
