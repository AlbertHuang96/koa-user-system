import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { createConnection } from 'typeorm';
import jwt from 'koa-jwt';
import 'reflect-metadata';

import { protectedRouter, unprotectedRouter } from './routes';
import { logger } from './logger';
import { JWT_SECRET } from './constants';

createConnection()
  .then(() => {
    const app = new Koa();

    // middleware
    app.use(logger());
    app.use(cors());
    app.use(bodyParser());

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { message: err.message };
      }
    });

    //app.use(router.routes()).use(router.allowedMethods());
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // run server
    app.listen(3000);
  })
  .catch((err: string) => console.log('TypeORM connection error:', err));


