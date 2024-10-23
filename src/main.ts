import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getPort } from './config/getPort';

const PORT = getPort();

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.enableCors();
  //nestApp.useGlobalPipes(new ValidationPipe());

  try {
    await nestApp.listen(PORT, () => {
      console.log(`Listening at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
bootstrap();
