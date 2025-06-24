import { App } from "../server/mod.ts";

const app = new App({ dev: false });

app.addStartupTask("hydrate");
app.addStartupTask("login");

await app.startup();

app.serve();
