using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using PoliTickIt.Ingestion.Normalization.Models;

namespace PoliTickIt.Ingestion.Normalization.Persistence;

/// <summary>
/// Manages persistence of normalization data
/// Loads from and saves to static JSON files
/// </summary>
public class NormalizationDataPersistence
{
    private readonly string _dataDirectory;
    private readonly JsonSerializerOptions _jsonOptions;
    
    private const string RepresentativesFile = "canonical-representatives.json";
    private const string BillsFile = "canonical-bills.json";
    private const string CommitteesFile = "canonical-committees.json";
    private const string DonorsFile = "canonical-donors.json";
    private const string CrossReferencesFile = "cross-references.json";
    
    public NormalizationDataPersistence(string dataDirectory = "Data/Normalization")
    {
        _dataDirectory = dataDirectory ?? throw new ArgumentNullException(nameof(dataDirectory));
        
        // Ensure directory exists
        Directory.CreateDirectory(_dataDirectory);
        
        _jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };
    }
    
    /// <summary>
    /// Load representatives from file
    /// </summary>
    public async Task<Dictionary<Guid, CanonicalRepresentative>> LoadRepresentativesAsync()
    {
        return await LoadFromFileAsync<Dictionary<Guid, CanonicalRepresentative>>(RepresentativesFile)
            ?? new Dictionary<Guid, CanonicalRepresentative>();
    }
    
    /// <summary>
    /// Save representatives to file
    /// </summary>
    public async Task SaveRepresentativesAsync(Dictionary<Guid, CanonicalRepresentative> data)
    {
        await SaveToFileAsync(RepresentativesFile, data);
    }
    
    /// <summary>
    /// Load bills from file
    /// </summary>
    public async Task<Dictionary<Guid, CanonicalBill>> LoadBillsAsync()
    {
        return await LoadFromFileAsync<Dictionary<Guid, CanonicalBill>>(BillsFile)
            ?? new Dictionary<Guid, CanonicalBill>();
    }
    
    /// <summary>
    /// Save bills to file
    /// </summary>
    public async Task SaveBillsAsync(Dictionary<Guid, CanonicalBill> data)
    {
        await SaveToFileAsync(BillsFile, data);
    }
    
    /// <summary>
    /// Load committees from file
    /// </summary>
    public async Task<Dictionary<Guid, CanonicalCommittee>> LoadCommitteesAsync()
    {
        return await LoadFromFileAsync<Dictionary<Guid, CanonicalCommittee>>(CommitteesFile)
            ?? new Dictionary<Guid, CanonicalCommittee>();
    }
    
    /// <summary>
    /// Save committees to file
    /// </summary>
    public async Task SaveCommitteesAsync(Dictionary<Guid, CanonicalCommittee> data)
    {
        await SaveToFileAsync(CommitteesFile, data);
    }
    
    /// <summary>
    /// Load donors from file
    /// </summary>
    public async Task<Dictionary<Guid, CanonicalDonor>> LoadDonorsAsync()
    {
        return await LoadFromFileAsync<Dictionary<Guid, CanonicalDonor>>(DonorsFile)
            ?? new Dictionary<Guid, CanonicalDonor>();
    }
    
    /// <summary>
    /// Save donors to file
    /// </summary>
    public async Task SaveDonorsAsync(Dictionary<Guid, CanonicalDonor> data)
    {
        await SaveToFileAsync(DonorsFile, data);
    }
    
    /// <summary>
    /// Load cross-references from file
    /// </summary>
    public async Task<Dictionary<string, Guid>> LoadCrossReferencesAsync()
    {
        return await LoadFromFileAsync<Dictionary<string, Guid>>(CrossReferencesFile)
            ?? new Dictionary<string, Guid>();
    }
    
    /// <summary>
    /// Save cross-references to file
    /// </summary>
    public async Task SaveCrossReferencesAsync(Dictionary<string, Guid> data)
    {
        await SaveToFileAsync(CrossReferencesFile, data);
    }
    
    /// <summary>
    /// Load all data at once
    /// </summary>
    public async Task<NormalizationDataSnapshot> LoadAllAsync()
    {
        return new NormalizationDataSnapshot
        {
            Representatives = await LoadRepresentativesAsync(),
            Bills = await LoadBillsAsync(),
            Committees = await LoadCommitteesAsync(),
            Donors = await LoadDonorsAsync(),
            CrossReferences = await LoadCrossReferencesAsync()
        };
    }
    
    /// <summary>
    /// Save all data at once
    /// </summary>
    public async Task SaveAllAsync(NormalizationDataSnapshot snapshot)
    {
        if (snapshot == null)
            throw new ArgumentNullException(nameof(snapshot));
        
        await SaveRepresentativesAsync(snapshot.Representatives);
        await SaveBillsAsync(snapshot.Bills);
        await SaveCommitteesAsync(snapshot.Committees);
        await SaveDonorsAsync(snapshot.Donors);
        await SaveCrossReferencesAsync(snapshot.CrossReferences);
    }
    
    private async Task<T?> LoadFromFileAsync<T>(string filename) where T : class
    {
        var filePath = Path.Combine(_dataDirectory, filename);
        
        if (!File.Exists(filePath))
        {
            return null;
        }
        
        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            return JsonSerializer.Deserialize<T>(json, _jsonOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading {filename}: {ex.Message}");
            return null;
        }
    }
    
    private async Task SaveToFileAsync<T>(string filename, T data) where T : class
    {
        if (data == null)
            return;
        
        var filePath = Path.Combine(_dataDirectory, filename);
        
        try
        {
            var json = JsonSerializer.Serialize(data, _jsonOptions);
            await File.WriteAllTextAsync(filePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving {filename}: {ex.Message}");
        }
    }
}

/// <summary>
/// Snapshot of all normalization data
/// </summary>
public class NormalizationDataSnapshot
{
    public Dictionary<Guid, CanonicalRepresentative> Representatives { get; set; } = new();
    public Dictionary<Guid, CanonicalBill> Bills { get; set; } = new();
    public Dictionary<Guid, CanonicalCommittee> Committees { get; set; } = new();
    public Dictionary<Guid, CanonicalDonor> Donors { get; set; } = new();
    public Dictionary<string, Guid> CrossReferences { get; set; } = new();
}
