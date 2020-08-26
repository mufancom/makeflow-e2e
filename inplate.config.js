const {containerConfigEnvs} = require('./deployment-metadata');

module.exports = {
  'docker-compose.yml': {
    data: {
      containerConfigEnvs,
    },
  },
};
