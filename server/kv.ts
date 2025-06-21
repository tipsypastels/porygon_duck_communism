export const kv = await Deno.openKv();

export const createQueue = (() => {
  type Handler<T> = (event: T) => void | Promise<void>;
  type Message<T> = { key: symbol; event: T };

  const handlers = new Map<symbol, Handler<never>>();

  kv.listenQueue(async (message: Message<never>) => {
    if (
      !message ||
      typeof message !== "object" ||
      typeof message.key !== "symbol"
    ) {
      return void console.warn(`KV queue got invalid message: ${message}`);
    }

    const handler = handlers.get(message.key);
    if (!handler) {
      return void console.warn(`KV queue got unhandled message type`);
    }

    await handler(message.event);
  });

  return <T>(handler: Handler<T>) => {
    const key = Symbol();
    handlers.set(key, handler);

    return async (event: T) => {
      await kv.enqueue({ key, event } satisfies Message<T>);
    };
  };
})();
