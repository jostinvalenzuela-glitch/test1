import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciasModule } from './incidencias/incidencias.module';

@Module({
  imports: [
    // 1. Cargamos las variables de entorno globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Esto crea las tablas automáticamente
      }),
    }),
    
    IncidenciasModule,
  ],
})
export class AppModule {}

