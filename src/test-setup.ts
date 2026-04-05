import { Window } from "happy-dom";

const happyWindow = new Window({ url: "http://localhost/" });

// Install DOM globals onto globalThis so @testing-library/react can access them
for (const key of Object.getOwnPropertyNames(happyWindow)) {
  if (!(key in globalThis)) {
    try {
      Object.defineProperty(globalThis, key, {
        get: () => (happyWindow as unknown as Record<string, unknown>)[key],
        configurable: true,
      });
    } catch {
      // some properties are non-configurable, skip
    }
  }
}

if (!("document" in globalThis)) {
  Object.defineProperty(globalThis, "document", {
    get: () => happyWindow.document,
    configurable: true,
  });
}
