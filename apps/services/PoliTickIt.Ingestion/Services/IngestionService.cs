using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Services;

public class IngestionService : IIngestionService
{
    private readonly IEnumerable<IDataSourceProvider> _providers;
    private readonly ISnapRepository _snapRepository;
    private readonly IManifestorMaintenanceService _maintenance;

    public IngestionService(
        IEnumerable<IDataSourceProvider> providers, 
        ISnapRepository snapRepository,
        IManifestorMaintenanceService maintenance)
    {
        _providers = providers;
        _snapRepository = snapRepository;
        _maintenance = maintenance;
    }

    public async Task<IEnumerable<PoliSnap>> RunIngestionAsync()
    {
        // 1. Stability Check: Create backup before ingestion cycle
        // ensuring we can always revert the context used for this run
        await _maintenance.CreateBackupAsync();

        var allSnaps = new List<PoliSnap>();
        
        foreach (var provider in _providers)
        {
            // 2. Oracle Drift & Heartbeat Detection
            // Blind polling is legacy. We now check the "Heartbeat" first.
            var hasNewData = await provider.CheckHeartbeatAsync();
            
            if (!hasNewData)
            {
                Console.WriteLine($"Oracle Pulse [{provider.ProviderName}]: No new truth detected. Skipping cycle.");
                continue;
            }

            await _maintenance.DetectOracleDriftAsync(provider.ProviderName);

            var snaps = await provider.FetchLatestSnapsAsync();
            allSnaps.AddRange(snaps);
        }

        // Logic here for deduplication, normalization, and persistence
        await _snapRepository.SaveSnapsAsync(allSnaps);

        // 3. Post-Ingestion Audit & Catalog Sync
        // Minimizes drift between live data oracles and the manifestation documentation.
        await _maintenance.AuditContextEfficiencyAsync();

        return allSnaps;
    }
}
