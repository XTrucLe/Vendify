import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FloorModule } from './modules/floor/floor.module';
import { IdentityModule } from './modules/identity/identity.module';
import databaseConfig from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrderingModule } from './modules/ordering/ordering.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getOrThrow<TypeOrmModuleOptions>('database'),
    }),

    CatalogModule,
    IdentityModule,
    FloorModule,
    OrderingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
