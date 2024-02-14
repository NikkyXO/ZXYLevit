import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const options = new DocumentBuilder()
    .setTitle('test-interview')
    .setDescription(
      'NOTE!!!: Please Use Postman to test With base url: "https://busy-pear-toad-shoe.cyclic.app" , Authentication test on swagger not reliable!',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
