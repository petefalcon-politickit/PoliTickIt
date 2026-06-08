using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Persistence;

public sealed class LocalFileWatchedProcessRepository : IWatchedProcessRepository
{
    private readonly List<WatchedProcess> _store = new();
    private readonly Lock _lock = new();

    public Task<IEnumerable<WatchedProcess>> GetForUserAsync(string userId, CancellationToken ct = default)
    {
        lock (_lock)
            return Task.FromResult<IEnumerable<WatchedProcess>>(
                _store.Where(p => p.UserId == userId).ToList());
    }

    public Task AddAsync(WatchedProcess process, CancellationToken ct = default)
    {
        lock (_lock)
            if (!_store.Any(p => p.UserId == process.UserId && p.CorrelationKey == process.CorrelationKey))
                _store.Add(process);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string userId, string correlationKey, CancellationToken ct = default)
    {
        lock (_lock) _store.RemoveAll(p => p.UserId == userId && p.CorrelationKey == correlationKey);
        return Task.CompletedTask;
    }

    public Task<bool> IsWatchingAsync(string userId, string correlationKey, CancellationToken ct = default)
    {
        lock (_lock)
            return Task.FromResult(_store.Any(p => p.UserId == userId && p.CorrelationKey == correlationKey));
    }

    public Task UpdateLastViewedAsync(string userId, string correlationKey, DateTime viewedAt, CancellationToken ct = default)
    {
        lock (_lock)
        {
            var proc = _store.FirstOrDefault(p => p.UserId == userId && p.CorrelationKey == correlationKey);
            if (proc != null) proc.LastViewedAt = viewedAt;
        }
        return Task.CompletedTask;
    }
}
