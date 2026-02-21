using System.Threading.Tasks;

namespace PoliTickIt.Domain.Interfaces;

/// <summary>
/// Service responsible for the self-optimization of the PoliManifestor's instruction set.
/// Implements the Autonomous Manifestor Maintenance (AMM) capability.
/// </summary>
public interface IManifestorMaintenanceService
{
    /// <summary>
    /// Audits recent ingestion outputs against the MANIFESTOR_INTELLIGENCE_CONTEXT.
    /// Returns a proposed "Context Patch" if optimizations are found.
    /// </summary>
    Task<string> AuditContextEfficiencyAsync();

    /// <summary>
    /// Checks for Schema Drift in known Data Oracles.
    /// </summary>
    Task<bool> DetectOracleDriftAsync(string providerName);

    /// <summary>
    /// Creates a timestamped backup of all context files in infra/ai-prompts.
    /// Manages a rolling window (e.g., last 5 backups).
    /// </summary>
    Task CreateBackupAsync();

    /// <summary>
    /// Reverts the context files to the last known stable backup.
    /// </summary>
    Task RollbackAsync();
}
