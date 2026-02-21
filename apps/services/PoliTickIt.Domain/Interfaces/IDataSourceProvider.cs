using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IDataSourceProvider
{
    string ProviderName { get; }
    Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync();
    Task<bool> CheckHeartbeatAsync();
}
