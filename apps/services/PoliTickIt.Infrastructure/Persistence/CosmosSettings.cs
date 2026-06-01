namespace PoliTickIt.Infrastructure.Persistence;

public sealed class CosmosSettings
{
    public const string SectionName = "CosmosDb";

    public string AccountEndpoint { get; set; } = string.Empty;
    public string AccountKey { get; set; } = string.Empty;
    public string DatabaseId { get; set; } = "PoliTickIt";
    public string UserContainerId { get; set; } = "User";
}
