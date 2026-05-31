// ============================================================
// DNA: PoliTickIt.Infrastructure · SnapDataOptions
// Purpose : Configuration options for LocalFileSnapRepository.
//           Resolved at startup in Program.cs and bound to the
//           DI options pipeline.
// Author  : Omni-OS Architect
// Created : 2026-06-01
// ============================================================

namespace PoliTickIt.Infrastructure.Persistence;

/// <summary>
/// Options for the local-file snap repository.
/// Set <see cref="DataPath"/> to the absolute directory that
/// contains one <c>{snapId}.json</c> file per snap.
/// </summary>
public class SnapDataOptions
{
    public const string SectionName = "SnapData";

    /// <summary>
    /// Absolute path to the folder containing snap JSON files.
    /// Default: <c>&lt;ContentRoot&gt;/Data/snaps</c> — resolved
    /// by Program.cs before registration.
    /// </summary>
    public string DataPath { get; set; } = string.Empty;
}
