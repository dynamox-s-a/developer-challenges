import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and starts the NestJS application.
 *
 * This function performs the following tasks:
 * - Creates the NestJS application with the root module (AppModule).
 * - Enables CORS (Cross-Origin Resource Sharing) for specific domains.
 * - Enables global validation pipes to ensure that incoming requests are validated.
 * - Sets up session management using `express-session` to store user session data.
 * - Starts the application and listens on the port specified by the `PORT` environment variable,
 *   or defaults to port 3001 if not defined.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application has started.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      },
      // store:
    }),
  );

  /**
   * Start the application and listen on the port specified by the `PORT` environment variable,
   * or default to port 3001 if not defined.
   */
  await app.listen(process.env.PORT ?? 3001);
}

// Call the bootstrap function to initialize and run the application
bootstrap();
