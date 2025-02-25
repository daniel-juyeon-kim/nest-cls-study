import { AsyncLocalStorage } from 'async_hooks';
import { setTimeout } from 'timers/promises';

describe('AsyncLocalStorage', () => {
  let asyncLocalStorage: AsyncLocalStorage<string>;

  beforeEach(() => {
    asyncLocalStorage = new AsyncLocalStorage<string>();
  });

  it('동일한 컨텍스트에서 값을 저장하고 조회할 수 있어야 한다.', () => {
    const store = '저장할 값';
    asyncLocalStorage.run(store, () => {
      expect(asyncLocalStorage.getStore()).toEqual(store);
    });
  });

  it('컨텍스트 외부에서는 저장된 값을 조회할 수 없어야 한다.', () => {
    expect(asyncLocalStorage.getStore()).toEqual(undefined);
  });

  it('서로 다른 컨텍스트에서는 값이 격리되어야 한다.', () => {
    const store1 = '저장할 값1';
    const store2 = '저장할 값2';

    asyncLocalStorage.run(store1, () => {
      expect(asyncLocalStorage.getStore()).toEqual(store1);

      setImmediate(() => {
        asyncLocalStorage.run(store2, () => {
          expect(asyncLocalStorage.getStore()).toEqual(store2);
        });
      });
    });
  });

  it('비동기 작업에서도 동일한 컨텍스트를 유지해야 한다.', async () => {
    const store = '저장할 값';

    const tstore = await asyncLocalStorage.run(store, async () => {
      const timeoutStore = await setTimeout(10, asyncLocalStorage.getStore());
      console.log(store, timeoutStore);

      expect(store).toEqual(timeoutStore);

      return timeoutStore;
    });

    expect(store).toEqual(tstore);
  });

  it('비동기 작업이 끝난 후에는 컨텍스트가 유지되지 않아야 한다.', async () => {
    const s1 = 'temporaryValue';

    asyncLocalStorage.run(s1, () => {});

    const s2 = await setTimeout(10, asyncLocalStorage.getStore());
    expect(s1).not.toEqual(s2);
    // 찾을 수 없음
    expect(s2).toEqual(undefined);
  });
});
