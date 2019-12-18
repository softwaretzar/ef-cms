import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { appPublic } from './appPublic';
import { applicationContextPublic } from './applicationContextPublic';

import { config } from './overmind';
import { createOvermind } from 'overmind';

const overmind = createOvermind(
  { ...config, ...applicationContextPublic },
  {
    devtools: !!process.env.USTC_DEBUG, // defaults to 'localhost:3031'
  },
);
