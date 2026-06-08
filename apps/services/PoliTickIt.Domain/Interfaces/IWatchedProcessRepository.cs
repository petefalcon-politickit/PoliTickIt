using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IWatchedProcessRepository
{
    Task<IEnumerable<WatchedProcess>> GetForUserAsync(string userId, CancellationToken ct = default);
    Task AddAsync(WatchedProcess process, CancellationToken ct = default);
    Task RemoveAsync(string userId, string correlationKey, CancellationToken ct = default);
    Task<bool> IsWatchingAsync(string userId, string correlationKey, CancellationToken ct = default);
    Task UpdateLastViewedAsync(string userId, string correlationKey, DateTime viewedAt, CancellationToken ct = default);
}
