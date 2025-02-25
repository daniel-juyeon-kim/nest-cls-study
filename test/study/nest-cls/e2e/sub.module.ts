import { Module } from '@nestjs/common';
import { CLS_VALUE, DI_TOKEN } from './constant';

@Module({
  providers: [{ provide: DI_TOKEN, useValue: CLS_VALUE }],
  exports: [DI_TOKEN],
})
export class SubModule {}
