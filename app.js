import express from 'express';
import db from './mongodb/db.js';
import config from 'config-lite';
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';
import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';
import log4js from 'log4js';
// import Statistic from './middlewares/statistic'


import main from './controller/collect/main.js';


const app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin || 'https://cangdu.org');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.send(200);
	} else {
	    next();
	}
});

log4js.configure({
  appenders: {
    out: { type: 'stdout' },//设置是否在控制台打印日志
	info: { type: 'file', filename: './logs/info.log' },
	collect: { type: 'file', filename: './logs/collect.log' },
    error: { type: 'file', filename: './logs/error.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'info', 'collect', 'error' ], level: 'info' }//去掉'out'。控制台不打印日志
  }
});

// app.use(Statistic.apiRecord)
const MongoStore = connectMongo(session);
app.use(cookieParser());





router(app);

main.startCollect();

app.use(history());
app.use(express.static('./public'));
app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
});