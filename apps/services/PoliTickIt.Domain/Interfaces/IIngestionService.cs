using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Domain.Interfaces;

public interface IIngestionService
{
    Task<IEnumerable<PoliSnap>> RunIngestionAsync();
}
