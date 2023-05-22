// next-logger.config.js
const pino = require('pino');

const transport = pino.transport({
  targets:[
    // {
    //   target: 'pino-pretty',
    //   options: {
    //     destination: 2,
    //     levelFirst: true,
    //     translateTime: 'yyyy-mm-dd HH:MM:ss',
    //     ignore: 'pid,hostname',
    //     messageFormat: '{levelLabel} {msg}',
    // }},
    {
      target: 'pino/file',
      level:"debug",
      options: {
        destination: './logs/info.log',
        ignore: 'pid,hostname',
        messageFormat: '{levelLabel} {msg}',
      },
    }
  ],
});


const logger = defaultConfig =>
  pino({
    ...defaultConfig,
    mixin: (_context, level) => ({ name: 'DIGITAL FINANCIERO', 'level-label': pino.levels.labels[level].toUpperCase()}),
    timeStamp: pino.stdTimeFunctions.isoTime,
  },transport);
module.exports = {
  logger,
}