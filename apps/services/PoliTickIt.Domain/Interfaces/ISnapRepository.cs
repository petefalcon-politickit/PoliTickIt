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
    }
}
