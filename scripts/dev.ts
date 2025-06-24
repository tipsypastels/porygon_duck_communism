import { App } from "../server/mod.ts";

const app = new App({ dev: true });

app.addStartupTask("register");
app.addStartupTask("login");

await app.startup();

app.serve();
