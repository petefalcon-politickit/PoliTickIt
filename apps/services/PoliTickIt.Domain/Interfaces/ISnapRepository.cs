using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces
{
    public interface ISnapRepository
    {
        Task SaveSnapAsync(PoliSnap snap);
        Task<IEnumerable<PoliSnap>> GetAllSnapsAsync();
        Task<PoliSnap?> GetSnapByIdAsync(string id);
        Task SaveSnapsAsync(IEnumerable<PoliSnap> snaps);
        /// <summary>
        /// Finds a snap by its stable domain content key (e.g. "bill:H.R.1041",
        /// "rep:D000622").  Returns null if no snap with that key exists.
        /// </summary>
        Task<PoliSnap?> FindByContentKeyAsync(string contentKey);
        /// <summary>
        /// Returns all snaps where <c>Max(CreatedAt, UpdatedAt) &gt; since</c>.
        /// Includes tombstones (<c>IsRetracted = true</c>) so mobile clients can evict.
        /// </summary>
        Task<IEnumerable<PoliSnap>> GetDeltaAsync(DateTimeOffset since);

        /// <summary>
        /// Returns all snaps sharing the given correlation key,
        /// ordered by ProcessStep ASC then CreatedAt ASC.
        /// </summary>
        Task<IEnumerable<PoliSnap>> GetByCorrelationKeyAsync(string correlationKey);

        /// <summary>
        /// Returns snaps whose Channels list contains at least one of the given channels.
        /// Ordered newest first. Capped at <paramref name="limit"/>.
        /// </summary>
        Task<IEnumerable<PoliSnap>> GetByChannelsAsync(IEnumerable<string> channels, int limit = 100);
    }
}
