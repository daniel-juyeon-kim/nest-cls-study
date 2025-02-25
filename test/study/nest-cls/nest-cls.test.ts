import { Test } from '@nestjs/testing';
import { ClsModule, ClsService, ClsServiceManager } from 'nestjs-cls';
import { setTimeout } from 'timers/promises';

describe('ClsService', () => {
  let clsService: ClsService;

  beforeEach(async () => {
    await Test.createTestingModule({
      imports: [ClsModule.forRoot({ global: true })],
    }).compile();

    clsService = ClsServiceManager.getClsService();
  });

  it('같은 컨텍스트에서 값을 저장하고 검색해야 합니다', async () => {
    await clsService.run(async () => {
      clsService.set('key', 'value');
      expect(clsService.get('key')).toEqual('value');
    });
  });

  it('비동기 작업 간에 값을 유지해야 합니다', async () => {
    await clsService.run(async () => {
      clsService.set('asyncKey', 'asyncValue');
      await setTimeout(100);
      expect(clsService.get('asyncKey')).toEqual('asyncValue');
    });
  });

  it('실행 간에 컨텍스트를 공유하지 않아야 합니다', async () => {
    await clsService.run(async () => {
      clsService.set('isolatedKey', 'value1');
    });

    await clsService.run(async () => {
      expect(clsService.get('isolatedKey')).toBeUndefined();
    });
  });

  it('없는 키에 대해 undefined를 반환해야 합니다', async () => {
    await clsService.run(async () => {
      expect(clsService.get('nonExistentKey')).toBeUndefined();
    });
  });

  it('run 외부에서 컨텍스트에 접근할 때 undefined를 반환', () => {
    expect(clsService.get('key')).toEqual(undefined);
  });

  it('여러 중첩된 컨텍스트를 독립적으로 실행해야 합니다', async () => {
    await clsService.run(async () => {
      clsService.set('outerKey', 'outerValue');

      await clsService.run(async () => {
        clsService.set('innerKey', 'innerValue');
        expect(clsService.get('innerKey')).toEqual('innerValue');
        expect(clsService.get('outerKey')).toEqual('outerValue');
      });

      expect(clsService.get('innerKey')).toBeUndefined();
      expect(clsService.get('outerKey')).toEqual('outerValue');
    });
  });

  it('ClsServiceManager를 통해 ClsService를 가져와야 합니다', async () => {
    const cls = ClsServiceManager.getClsService();
    await cls.run(async () => {
      cls.set('managerKey', 'managerValue');
      expect(cls.get('managerKey')).toEqual('managerValue');
    });
  });

  it('컨텍스트 내부에서 함수를 호출하면 호출한 함수에서 같은 컨텍스트를 공유합니다.', async () => {
    const cls = ClsServiceManager.getClsService();

    const asyncFn = async () => {
      const cls = ClsServiceManager.getClsService();
      cls.set('key', 'value');
      await setTimeout(30);

      expect(cls.get('key')).toEqual('value');
    };

    await cls.run(async () => {
      await asyncFn();
    });
  });

  it('컨텍스트 내부에서는 isActive가 true 밖에서는 false', () => {
    const cls = ClsServiceManager.getClsService();

    expect(cls.isActive()).toEqual(false);

    cls.run(() => {
      expect(cls.isActive()).toEqual(true);
    });
  });

  it('컨텍스트 내부에서 함수를 호출하면 호출한 함수에서도 isActive가 true', async () => {
    const cls = ClsServiceManager.getClsService();

    expect(cls.isActive()).toEqual(false);

    const asyncFn = async () => {
      await setTimeout(30);
      const cls = ClsServiceManager.getClsService();

      expect(cls.isActive()).toEqual(true);
    };

    await cls.run(async () => {
      expect(cls.isActive()).toEqual(true);
      asyncFn();
    });
  });
});

describe('ClsService', () => {
  describe('모듈 등록 없이도 ClsServiceManager를 통해 컨텍스트를 사용 가능함', () => {
    it('ClsServiceManager를 통해 ClsService를 가져와야 합니다', async () => {
      const cls = ClsServiceManager.getClsService();
      await cls.run(async () => {
        cls.set('managerKey', 'managerValue');
        expect(cls.get('managerKey')).toEqual('managerValue');
      });
    });

    it('컨텍스트 내부에서 함수를 호출하면 호출한 함수에서 같은 컨텍스트를 공유합니다.', async () => {
      const cls = ClsServiceManager.getClsService();

      const asyncFn = async () => {
        await setTimeout(30);
        const cls = ClsServiceManager.getClsService();
        cls.set('key', 'value');

        expect(cls.get('key')).toEqual('value');
      };

      await cls.run(async () => {
        await asyncFn();
      });
    });

    it('컨텍스트 내부에서는 isActive가 true 밖에서는 false', () => {
      const cls = ClsServiceManager.getClsService();

      expect(cls.isActive()).toEqual(false);

      cls.run(() => {
        expect(cls.isActive()).toEqual(true);
      });
    });

    it('컨텍스트 내부에서 함수를 호출하면 호출한 함수에서도 isActive가 true', async () => {
      const cls = ClsServiceManager.getClsService();

      expect(cls.isActive()).toEqual(false);

      const asyncFn = async () => {
        await setTimeout(30);
        const cls = ClsServiceManager.getClsService();

        expect(cls.isActive()).toEqual(true);
      };

      await cls.run(async () => {
        expect(cls.isActive()).toEqual(true);
        asyncFn();
      });
    });
  });
});
