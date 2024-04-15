import { Global, Module } from '@nestjs/common';
import { CrmApiService } from './crm-api.service';

@Global()
@Module({
  providers: [CrmApiService],
  exports: [CrmApiService],
})
export class CrmApiModule {}
