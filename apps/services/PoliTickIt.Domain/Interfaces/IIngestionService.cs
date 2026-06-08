using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IIngestionService
{
    Task<IEnumerable<PoliSnap>> RunIngestionAsync();

    /// <summary>
    /// Runs a single named provider by its <c>ProviderName</c>.
    /// Provider lookup is case-insensitive.
    /// </summary>
    /// <exception cref="ProviderNotFoundException">
    /// Thrown when no provider with the given name is registered.
    /// </exception>
    Task<IEnumerable<PoliSnap>> RunProviderAsync(string providerName);
}
