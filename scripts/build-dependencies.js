#!/usr/bin/env node

const fetch = require('node-fetch');
const {main} = require('main-function');
const v = require('villa');

const {CI_API_V4_URL, CI_JOB_TOKEN} = process.env;

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
    let response = await fetch({
      method: 'POST',
      url: `${CI_API_V4_URL}/projects/${id}/pipeline?ref=${branch}`,
      headers: {
        'PRIVATE-TOKEN': CI_JOB_TOKEN,
      },
    });

    console.log(response.status);

    let json = await response.text();

    console.log(json);
  }
}
