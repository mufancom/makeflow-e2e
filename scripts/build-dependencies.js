#!/usr/bin/env node

const fetch = require('fetch');
const {main} = require('main-function');

main(async ([TOKEN]) => {
  console.log(process.env);
});
