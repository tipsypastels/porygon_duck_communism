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
        return void console.warn(`Queue got invalid message ${message}`);
      }

      const { key, event } = message;
      const handler = handlers.get(key);

      if (!handler) {
        return void console.warn(`Queue got unhandled key '${key}'`);
      }

      console.log(`Queue '${key}' got message`);
      await handler(event);
    });
  }

  function createQueue<T>(key: string, handler: Handler<T>) {
    handlers.set(key, handler);
    console.log(`Created '${key}' queue`);

    return async (event: T) => {
      await kv.enqueue({ key, event } satisfies Message<T>);
    };
  }

  return { startQueues, createQueue };
})();
