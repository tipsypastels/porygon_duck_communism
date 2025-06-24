import * as Discord from "discord-api-types";

export class User {
  readonly id: string;
  readonly username: string;
  readonly globalName: string | undefined;

  constructor(data: Discord.APIUser) {
    this.id = data.id;
    this.username = data.username;
    this.globalName = data.global_name ?? undefined;
  }

  get displayName() {
    return this.globalName ?? this.username;
  }

  toString() {
    return this.displayName;
  }
}
