// ============================================================
// DNA: PoliTickIt.Domain · IReloadableSnapRepository
// Purpose : Hot-reload contract for snap repositories that
//           can refresh in-memory state from an external source
//           without an application redeploy.
// Author  : Omni-OS Architect
// Created : 2026-06-01
// ============================================================

namespace PoliTickIt.Domain.Interfaces;

/// <summary>
/// Extends a snap repository with the ability to reload its
/// data from the underlying source (e.g. local JSON files)
/// at runtime, without restarting the application.
/// </summary>
public interface IReloadableSnapRepository
{
    /// <summary>
    /// Clears the current in-memory state and reloads all snap
    /// data from the backing source.
    /// </summary>
    Task ReloadAsync();
}
