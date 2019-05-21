#!/usr/bin/env node

const fetch = require('node-fetch');
const {main} = require('main-function');
const v = require('villa');

const {CI_API_V4_URL, PRIVATE_TOKEN} = process.env;

const PROJECTS = [
  {
    id: 21,
    branch: 'master',
  },
];

main(async () => {
  await v.parallel(PROJECTS, project => buildProject(project));
});

async function buildProject({id, branch}) {
  await trigger();

  async function trigger() {
    let url = `${CI_API_V4_URL}/projects/${id}/pipeline?ref=${branch}`;

    console.log(url);

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': PRIVATE_TOKEN,
      },
    });

    console.log(response.status);

    let json = await response.text();

    console.log(json);
  }
}
