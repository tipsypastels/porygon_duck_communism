export const DEV = Deno.env.get("DEV") === "1";

console.log(`Environment: ${DEV ? "development" : "production"}`);
