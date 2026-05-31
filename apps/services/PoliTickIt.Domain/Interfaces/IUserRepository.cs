// ─────────────────────────────────────────────────────────────────────────────
// FILE        : IUserRepository.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Interfaces
// PURPOSE     : Contract for user persistence. Implementations: InMemoryUserRepository
//               (beta) → EF Core DbContext (production).
// ─────────────────────────────────────────────────────────────────────────────

using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> FindByEmailAsync(string email);
    Task<AppUser?> FindByIdAsync(Guid id);
    Task AddAsync(AppUser user);
    Task UpdateAsync(AppUser user);
}
