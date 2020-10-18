import { NgModule } from '@angular/core';
import { MappingsService, SmsService, SyncService } from '.';
import { SmsParserService } from './sms-parser.service';
import { SmsReaderService } from './sms-reader.service';

@NgModule({
  imports: [],
  providers: [
    SyncService,
    SmsService,
    SmsReaderService,
    SmsParserService,
    MappingsService,
  ],
})
export class ServicesModule {}
