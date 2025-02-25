import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { CLS_KEY, DI_TOKEN } from './constant';
import { SubModule } from './sub.module';
import { TestController } from './test.controller';

@Module({
  imports: [
    ClsModule.forRootAsync({
      imports: [SubModule],
      inject: [DI_TOKEN],
      global: true,
      useFactory: (value: string) => ({
        middleware: {
          mount: true,
          setup: (cls) => {
            cls.set(CLS_KEY, value);
          },
        },
      }),
    }),
  ],
  controllers: [TestController],
})
export class AppModule {}
