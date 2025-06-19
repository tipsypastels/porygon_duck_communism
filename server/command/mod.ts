export interface Command {
  (params: CommandParams): Promise<void>;
}

export interface CommandParams {
}
