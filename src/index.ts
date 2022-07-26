import {ApplicationConfig, TodolistApplication} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodolistApplication(options);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  let config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
      path: ''
    },
  };

  //Azure Check
//If process.env.PORT includes 'pipe' we need to set the path property
//Rest server ignores port property if path is set
if (process.env.PORT && process.env.PORT.includes('pipe'))
config.rest.path = process.env.PORT;

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
