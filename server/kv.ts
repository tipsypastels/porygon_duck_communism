export const kv = await Deno.openKv();

export const { startQueues, createQueue } = (() => {
  type Handler<T> = (event: T) => void | Promise<void>;
  type Message<T> = { key: string; event: T };

  const handlers = new Map<string, Handler<never>>();

  function startQueues() {
    kv.listenQueue(async (message: Message<never>) => {
      if (
        !message ||
        typeof message !== "object" ||
        typeof message.key !== "string"
      ) {
        return void console.warn(`KV queue got invalid message: ${message}`);
      }

      const handler = handlers.get(message.key);
      if (!handler) {
        return void console.warn(`KV queue got unhandled message type`);
      }

      await handler(message.event);
    });
  }

  function createQueue<T>(handler: Handler<T>) {
    const key = crypto.randomUUID();
    handlers.set(key, handler);

    return async (event: T) => {
      await kv.enqueue({ key, event } satisfies Message<T>);
    };
  }

  return { startQueues, createQueue };
})();
