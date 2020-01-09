import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { appPublic } from './appPublic';
import { applicationContextPublic } from './applicationContextPublic';

appPublic.initialize(applicationContextPublic, {
  devtools: !!process.env.USTC_DEBUG,
});
