import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { AOPDecoratorWithInnerCls } from './cls-access.decorator';
import { CLS_KEY } from './constant';

@Controller()
export class TestController {
  @Get('pass')
  @AOPDecoratorWithInnerCls()
  async pass() {
    const cls = ClsServiceManager.getClsService();

    if (!cls.isActive()) {
      throw new InternalServerErrorException('cls가 활성상태가 아님');
    }

    const value = cls.get(CLS_KEY);

    if (!value) {
      throw new InternalServerErrorException(
        'ENTITY_MANAGER_KEY에 대한 값이 존재하지 않음',
      );
    }

    return {
      ENTITY_MANAGER: value,
      isActive: cls.isActive(),
    };
  }

  // @Get('fail')
  // @AOPDecoratorOuterCls()
  // fail() {
  //   const cls = ClsServiceManager.getClsService();

  //   if (!cls.isActive()) {
  //     throw new InternalServerErrorException('cls가 활성상태가 아님');
  //   }

  //   const value = cls.get(CLS_KEY);

  //   if (!value) {
  //     throw new InternalServerErrorException(
  //       'ENTITY_MANAGER_KEY에 대한 값이 존재하지 않음',
  //     );
  //   }

  //   return {
  //     ENTITY_MANAGER: value,
  //     isActive: cls.isActive(),
  //   };
  // }
}
