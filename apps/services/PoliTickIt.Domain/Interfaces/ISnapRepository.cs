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
    }
}
