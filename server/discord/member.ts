import * as Discord from "discord-api-types";
import { User } from "./user.ts";

export class GuildMember {
  readonly id: string;
  readonly user: User;
  readonly nickname: string | undefined;

  constructor(
    data: Discord.APIGuildMember,
  ) {
    this.id = data.user.id;
    this.user = new User(data.user);
    this.nickname = data.nick ?? undefined;
  }

  get displayName() {
    return this.nickname ?? this.user.displayName;
  }

  toString() {
    return this.displayName;
  }
}
