// ─────────────────────────────────────────────────────────────────────────────
// FILE        : InMemoryUserRepository.cs
// PROJECT     : PoliTickIt.Infrastructure
// LAYER       : Infrastructure → Persistence
// PURPOSE     : Thread-safe in-memory IUserRepository for beta.
//               All users are lost on restart — replace with EF Core before
//               production. Uses ConcurrentDictionary keyed on UserId (Guid).
// ─────────────────────────────────────────────────────────────────────────────

using System.Collections.Concurrent;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Infrastructure.Persistence;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly ConcurrentDictionary<Guid, AppUser> _byId = new();
    private readonly ConcurrentDictionary<string, Guid> _emailIndex = new(StringComparer.OrdinalIgnoreCase);

    public Task<AppUser?> FindByEmailAsync(string email)
    {
        if (_emailIndex.TryGetValue(email, out var id) && _byId.TryGetValue(id, out var user))
            return Task.FromResult<AppUser?>(user);
        return Task.FromResult<AppUser?>(null);
    }

    public Task<AppUser?> FindByIdAsync(Guid id)
    {
        _byId.TryGetValue(id, out var user);
        return Task.FromResult(user);
    }

    public Task AddAsync(AppUser user)
    {
        _byId[user.Id] = user;
        _emailIndex[user.Email] = user.Id;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(AppUser user)
    {
        _byId[user.Id] = user;
        // Email index is immutable after registration in this beta impl
        return Task.CompletedTask;
    }
}
