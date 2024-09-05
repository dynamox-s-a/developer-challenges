import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'), // Caminho para o build do frontend
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
