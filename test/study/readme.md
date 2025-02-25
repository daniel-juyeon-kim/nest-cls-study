cls는 run 함수 콜백 에서 컨텍스트를 가짐

데코레이터를 이용할때 descriptor.value에 cls 컨텍스트에 접근하는 코드를 작성해야 접근 가능함 외부로 빼면 불가능

```ts
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
```
