import { Controller, Get, Query } from '@nestjs/common';
import { CrmApiService } from './crm-api/crm-api.service';

@Controller('api')
export class AppController {
  constructor(private readonly crmApiService: CrmApiService) {}

  @Get('leads')
  getLeads(@Query() query) {
    return this.crmApiService.getLeads(query);
  }
}
