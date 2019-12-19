import { createConnect, createHook } from 'overmind-react';

const config = {
  actions: {},
  state: {},
};

const useOvermind = createHook(); // will this get used? Hmm
const connect = createConnect();

// eslint-disable-next-line spellcheck/spell-checker
// https://overmindjs.org/guides/beginner/08_usingovermindwithreact?view=react&typescript=false
export { config, connect, useOvermind };
