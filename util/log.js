// import debug from 'debug';
// import bug from 'debug';
// const log = bug('antwerp');
// if (debug) bug.enable('rsend');
// export default {
//   log:log,
//   info:log,
//   error:log
// }

import winston from 'winston';
import {difference, intersection, kebabCase} from 'lodash-es';

const { combine, timestamp, printf, colorize, align } = winston.format;
const used = ['timestamp', 'level', 'message'];

export default winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
    // align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} ${difference(Object.keys(info), used).map(key=>`${kebabCase(key)}: ${info[key]}`).join(' ')}`)
  ),
  transports: [new winston.transports.Console()],
});
