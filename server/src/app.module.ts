import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CrmApiModule } from './crm-api/crm-api.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CrmApiModule],
  controllers: [AppController],
})
export class AppModule {}
