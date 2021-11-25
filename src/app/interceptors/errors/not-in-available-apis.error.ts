export class NotInAvailableApisError extends Error {
  public constructor(public readonly requestedApiKey: string) {
    super(`L'api: ${requestedApiKey} n'est pas présente dans la liste des api disponibles`);
  }
}
