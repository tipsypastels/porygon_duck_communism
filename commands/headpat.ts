// TODO: Consider making custom art for these,
// porygon2's use of anime gifs for it is lame.

import { fuse, Subcommand } from "../server/discord/command/mod.ts";
import { kv } from "../server/kv.ts";
import { createQueue } from "../server/queue.ts";

const give: Subcommand = async ({ embed, author, options }) => {
  const friend = options.getMember("friend");
  const isSelf = friend.id === author.id;

  embed
    .setTitle(`${friend} has been headpat!`)
    .setPoryColor("ok");

  if (!isSelf) {
    const count = await impl.get(friend.id) + 1n; // account for the current one
    embed.setFooterText(
      `${friend} has been headpat ${count} time${count !== 1n ? "s" : ""}`,
    );

    await impl.enqueueIncrement(friend.id);
  }
};

give.build = (cmd) => {
  cmd
    .setName("give")
    .setDescription("Offers a headpat to a friend.")
    .addUserOption((opt) =>
      opt
        .setName("friend")
        .setDescription("The friend to headpat.")
        .setRequired(true)
    );
};

const scores: Subcommand = () => {
  console.log("scores");
};

scores.build = (cmd) => {
  cmd
    .setName("scores")
    .setDescription("Shows the most headpatted members.");
};

export const headpat = fuse({ give, scores }, (cmd) => {
  cmd
    .setName("headpat")
    .setDescription("Headpat-related commands.");
});

/* -------------------------------------------------------------------------- */
/*                               Implementation                               */
/* -------------------------------------------------------------------------- */

const impl = (() => {
  const PREFIX = "headpats";

  const key = (id: string): Deno.KvKey => [PREFIX, id];

  return {
    async get(id: string) {
      return (await kv.get<bigint>(key(id)))?.value ?? 0n;
    },

    enqueueIncrement: createQueue("headpatincrement", async (id: string) => {
      const { ok } = await kv.atomic().sum(key(id), 1n).commit();
      if (!ok) console.error("Failed to update headpat score");
    }),
  };
})();
