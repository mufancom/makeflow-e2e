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

let patterns: (string | undefined)[] = _.compact(
  Array.from(transitionMatchOptionsMap.keys()),
);
let states: string[] = Array.from(defineNodeMap.keys());
let initializeAliases: string[] = _.compact(
  initializeNodes.map((node: any) => node._alias),
);
let transitionAliases: string[] = _.compact(
  transitionNodes.map((node: any) => node._alias),
);

if (!patterns.length) {
  patterns.push(undefined);
}

states.sort();

let statePatternSet = new Set(states);

for (let state of states) {
  let regex = /[:/]/g;
  let groups: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((groups = regex.exec(state))) {
    let prefix = state.slice(0, groups.index + 1);

    if (prefix.endsWith('/')) {
      statePatternSet.add(`${prefix}*`);
      statePatternSet.add(`${prefix}**`);
      statePatternSet.add(`${prefix.slice(0, -1)}{,/**}`);
    } else {
      statePatternSet.add(`${prefix}**`);
    }
  }
}

let statePatterns = Array.from(statePatternSet).sort();

FS.writeFileSync(
  Path.join(__dirname, '@types/turning.d.ts'),
  `\
// Automatically generated turning types

interface TurningGenericParams {
  pattern:
${patterns
  .map(pattern => `    | ${pattern ? `'${pattern}'` : 'never'}`)
  .join('\n')};
  state:
${states.map(state => `    | '${state}'`).join('\n')};
  statePattern:
${statePatterns.map(statePattern => `    | '${statePattern}'`).join('\n')};
  initializeAlias:
${initializeAliases
  .map(initializeAlias => `    | '${initializeAlias}'`)
  .join('\n')};
  transitionAlias:
${transitionAliases
  .map(transitionAlias => `    | '${transitionAlias}'`)
  .join('\n')};
}
`,
);
