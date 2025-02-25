import { InternalServerErrorException } from '@nestjs/common';
import { ClsService, ClsServiceManager, ClsStore } from 'nestjs-cls';
import { CLS_KEY } from './constant';

export const AOPDecoratorOuterCls = () => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const cls = ClsServiceManager.getClsService();

    validateCls(cls);

    const value = cls.get(CLS_KEY);

    validateFalsy(value);

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // NOTE: 재할당 되는 함수 내부에서 cls에 접근해야 정상적으로 동작한다.
      return originalMethod.apply(this, args);
    };
  };
};

export const AOPDecoratorWithInnerCls = () => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cls = ClsServiceManager.getClsService();

      validateCls(cls);

      const value = cls.get(CLS_KEY);

      validateFalsy(value);

      return await originalMethod.apply(this, args);
    };
  };
};

const validateFalsy = (value: string) => {
  if (!value) {
    throw new InternalServerErrorException('cls 컨테스트의 값이 falsy한 값임');
  }
};

const validateCls = (cls: ClsService<ClsStore>) => {
  if (!cls.isActive()) {
    throw new InternalServerErrorException('cls가 활성화 되어있지 않음');
  }
};
