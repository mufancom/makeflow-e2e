import * as FS from 'fs';
import * as Path from 'path';

import _ from 'lodash';

import './@states';
import './@transitions';

import {turning} from './@turning';

let {
  transitionMatchOptionsMap,
  defineNodeMap,
  initializeNodes,
  transitionNodes,
} = turning as any;

let patterns: string[] = _.compact(
  Array.from(transitionMatchOptionsMap.keys()),
);
let states: string[] = Array.from(defineNodeMap.keys());
let aliases: string[] = _.compact(
  [...initializeNodes, ...transitionNodes].map(node => node._alias),
);

if (!patterns.length) {
  patterns.push('never');
}

let stateSet = new Set(states);

for (let state of states) {
  let segments = state.split(':');

  for (let i = 1; i < segments.length; i++) {
    stateSet.add([...segments.slice(0, i), '*'].join(':'));
  }
}

states = Array.from(stateSet).sort();

FS.writeFileSync(
  Path.join(__dirname, '../test/@types/turning.d.ts'),
  `\
// Automatically generated turning types

type TurningPattern =
${patterns.map(pattern => `  | '${pattern}'`).join('\n')};

type TurningState =
${states.map(state => `  | '${state}'`).join('\n')};

type TurningAlias =
${aliases.map(alias => `  | '${alias}'`).join('\n')};
`,
);
