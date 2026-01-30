import { getDefaultFontSize } from './utils';

const DEFAULT_FONT_SIZE = getDefaultFontSize() || 16;
export const LIMIT = 427000;
export const SCREENS = (4000 * DEFAULT_FONT_SIZE) / 16;
export const COLUMNS = 10;
export const ROWS = 10;
export const ROWS_PER_METRE = (SCREENS * ROWS) / LIMIT;
export const METRES_PER_ROW = LIMIT / (SCREENS * ROWS);
