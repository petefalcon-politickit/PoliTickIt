namespace PoliTickIt.Domain.Models;

public class WatchedProcess
{
    /// <summary>Deterministic composite: first 16 hex chars of SHA256("{userId}:{correlationKey}").</summary>
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string CorrelationKey { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string ProcessType { get; set; } = string.Empty;
    public DateTime WatchedSince { get; set; } = DateTime.UtcNow;
    public bool NotifyOnUpdate { get; set; } = true;
    public DateTime? LastViewedAt { get; set; }
}
