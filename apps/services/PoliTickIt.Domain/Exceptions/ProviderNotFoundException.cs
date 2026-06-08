// ─────────────────────────────────────────────────────────────────────────────
// FILE        : ProviderNotFoundException.cs
// PROJECT     : PoliTickIt.Domain
// LAYER       : Domain → Exceptions
// PURPOSE     : Thrown by IngestionService.RunProviderAsync when no provider
//               matching the requested name is registered in DI.
//               Mapped to HTTP 404 in the API layer.
// ─────────────────────────────────────────────────────────────────────────────

using System;

namespace PoliTickIt.Domain.Exceptions;

/// <summary>
/// Thrown when a requested provider name does not match any registered
/// <c>IDataSourceProvider</c> implementation.
/// </summary>
public sealed class ProviderNotFoundException : Exception
{
    public string ProviderName { get; }

    public ProviderNotFoundException(string providerName)
        : base($"No ingestion provider registered with name '{providerName}'.")
    {
        ProviderName = providerName;
    }
}
