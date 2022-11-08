import { cameraBubbleId } from "./identifiers";
import { Injector, DeInjector, Injection } from "./injection";

beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = () => jest.fn();
});

beforeEach(() => {
  globalThis.chrome = {
    // @ts-expect-error Chrome global object doesn't implemented in jest context, but TS waiting for it
    scripting: {
      executeScript: jest.fn(),
    },
  };
});

describe("Injector", () => {
  test("screenCapture", async () => {
    const tabId = 11;
    await Injector.screenCapture(tabId);

    expect(chrome.scripting.executeScript).toBeCalledTimes(1);
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId },
      files: [Injection.ScreenCapture],
    });
  });

  test("cameraBubble", async () => {
    const tabId = 11;
    await Injector.cameraBubble(tabId);

    expect(chrome.scripting.executeScript).toBeCalledTimes(1);
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId },
      files: [Injection.CameraBubble],
    });
  });
});

describe("DeInjector", () => {
  test("cameraBubble", async () => {
    const tabId = 11;
    await DeInjector.cameraBubble(tabId);

    expect(chrome.scripting.executeScript).toBeCalledTimes(1);
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId },
      func: expect.anything() as (id: string) => void,
      args: [cameraBubbleId],
    });
  });
});
