import { NgModule } from '@angular/core';
import { MappingsService } from './mappings.service';
import { SmsParserService } from './sms-parser.service';
import { SmsReaderService } from './sms-reader.service';
import { SmsService } from './sms.service';
import { SyncService } from './sync.service';

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
