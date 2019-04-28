import ChildProcess from 'child_process';

import 'villa/platform/node';

import getPort from 'get-port';
import main from 'main-function';
import fetch from 'node-fetch';
import {Dict} from 'tslang';
import * as v from 'villa';

import {PROJECT_DIR} from './paths';

const SERVER_START_UP_TIMEOUT = 40 * 1000;
const SERVER_STARTUP_CHECK_INTERVAL = 2000;

const {ENVIRONMENT, CI_COMMIT_SHA} = process.env;

main(async () => {
  let dockerKillHandler: DockerKillHandler | undefined;

  try {
    let port = await getPort();

    console.info('Building image...');
    await runCommand('./docker/scripts/build-image.sh');

    console.info('Cleaning unused network...');
    await runCommand('docker network prune --force');

    console.info('Starting docker...');
    dockerKillHandler = startDocker(port);

    console.info('Waiting for server to start up...');
    await waitUntilServerIsAvailable(port);
    console.info(`Test server is listening on port(${port}).`);

    // Run tests
    await runCommand('yarn test:e2e', {
      ...process.env,
      MAKEFLOW_E2E_PORT: String(port),
    });
  } finally {
    if (dockerKillHandler) {
      console.info('Killing docker...');
      await dockerKillHandler();
    }

    // Clean images
    await runCommand('./docker/scripts/clean-e2e-images.sh');
  }
});

type DockerKillHandler = () => Promise<void>;

function startDocker(port: number): DockerKillHandler {
  let projectName = CI_COMMIT_SHA
    ? `makeflow-web-${CI_COMMIT_SHA}`
    : 'makeflow-web';

  let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-${ENVIRONMENT}.yml`;

  let command = `${composeCommand} up --force-recreate --always-recreate-deps --renew-anon-volumes`;

  let dockerProcess = ChildProcess.exec(command, {
    cwd: PROJECT_DIR,
    env: {
      ...process.env,
      MAKEFLOW_E2E_PORT: String(port),
    },
  });

  dockerProcess.stdout.pipe(process.stdout);
  dockerProcess.stderr.pipe(process.stderr);

  return async () => {
    await runCommand(`${composeCommand} down`);
  };
}

async function waitUntilServerIsAvailable(port: number): Promise<void> {
  const API_PING_URL = `http://localhost:${port}/api/ping`;

  for (
    let i = 0;
    i * SERVER_STARTUP_CHECK_INTERVAL < SERVER_START_UP_TIMEOUT;
    i++
  ) {
    try {
      let response = await fetch(API_PING_URL);

      let text = await response.text();

      if (text === 'pong') {
        return;
      } else {
        throw new Error(`Unknown response from E2E test server`);
      }
    } catch (error) {
      console.info(`Connection failed. Trying the ${i + 1}th time...`);
    }

    await v.sleep(SERVER_STARTUP_CHECK_INTERVAL);
  }

  throw new Error(`E2E test server connection timeout (${API_PING_URL})`);
}

async function runCommand(
  command: string,
  env?: Dict<string> | undefined,
): Promise<void> {
  console.info(`$ ${command}`);

  let commandProcess = ChildProcess.exec(command, {cwd: PROJECT_DIR, env});

  commandProcess.stdout.pipe(process.stdout);
  commandProcess.stderr.pipe(process.stderr);

  await v.awaitable(commandProcess);
}
