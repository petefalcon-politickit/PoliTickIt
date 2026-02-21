# PoliTickIt Nexus: Syntax Errors Guide
## Shared Knowledge Base for .NET and Mobile Solutions

**Document Version:** 1.0  
**Last Updated:** 2026-01-30  
**Scope:** PoliTickIt.Api, PoliTickIt.Ingestion, PoliTickIt.Infrastructure, PoliTickIt.Domain  
**Applies To:** C# 13.0, .NET 9, VS Code, Visual Studio

---

## Table of Contents
1. [Overview](#overview)
2. [Common Syntax Errors](#common-syntax-errors)
3. [Root Causes](#root-causes)
4. [Prevention Strategies](#prevention-strategies)
5. [Quick Reference](#quick-reference)
6. [Error Recovery](#error-recovery)

---

## Overview

This document serves as a centralized knowledge base for identifying, preventing, and resolving syntax errors across the PoliTickIt solution architecture. Both mobile and backend teams can reference this guide to maintain consistent code quality and reduce debugging cycles.

### Key Principles
- **DRY (Don't Repeat Yourself):** Avoid duplicating data structures
- **Strict Syntax Validation:** All dictionary and collection initializers must follow C# grammar rules
- **Consistent Formatting:** Use uniform indentation and comma placement
- **Type Safety:** Leverage C# 13.0 strong typing features

---

## Common Syntax Errors

### 1. **Trailing Comma in Dictionary Entries** ?

#### Error Example
```csharp
// WRONG: Trailing comma after the value (not key-value pair)
Data = new Dictionary<string, object>
{
    { "verificationLevel", "Tier 3", },  // ? Extra comma here
    { "oracleSource", "House Committee on Ethics" }
}
```

#### Error Message
```
CS1525: Invalid expression term '}'
```

#### Root Cause
The comma after `"Tier 3"` is interpreted as a separator for another dictionary entry, but the closing `}` follows instead. This violates the key-value pair syntax.

#### Correct Implementation
```csharp
// CORRECT: No trailing comma on the last entry
Data = new Dictionary<string, object>
{
    { "verificationLevel", "Tier 3" },  // ? No comma after value
    { "oracleSource", "House Committee on Ethics" }
}
```

#### When Trailing Commas ARE Valid
```csharp
// VALID: Trailing comma AFTER the entire key-value pair tuple
var dict = new Dictionary<string, object>
{
    { "key1", "value1" },  // ? Comma after the pair is OK
    { "key2", "value2" }   // ? Last pair has no comma
};

// VALID: In C# 7.1+, trailing commas are allowed in collections
var list = new List<string>
{
    "item1",
    "item2",
};  // ? Trailing comma in the list is valid
```

---

### 2. **Missing Metadata Assemblies** ??

#### Error Example
```
CS0006: Metadata file 'C:\...\PoliTickIt.Infrastructure\obj\Debug\net9.0\ref\PoliTickIt.Infrastructure.dll' could not be found
```

#### Root Cause
- Solution was not fully rebuilt after dependency changes
- Stale build artifacts from previous builds
- Project references not properly restored
- Incomplete NuGet restore

#### Recovery Steps
```powershell
# Clean all build artifacts
dotnet clean

# Restore NuGet packages
dotnet restore

# Full rebuild
dotnet build

# Or in Visual Studio: Build ? Clean Solution ? Rebuild Solution
```

---

### 3. **Invalid Namespace References** ??

#### Error Example
```csharp
// WRONG: Using interface from wrong namespace
using PoliTickIt.Ingestion.Services;  // ? Wrong namespace

public class IngestionController
{
    private readonly IIngestionService _service;  // ? Can't find IIngestionService here
}
```

#### Error Message
```
CS0246: The type or namespace name 'IIngestionService' could not be found
```

#### Correct Implementation
```csharp
// CORRECT: Import interface from Domain namespace
using PoliTickIt.Domain.Interfaces;  // ? Correct namespace

public class IngestionController
{
    private readonly IIngestionService _service;  // ? Found!
}
```

#### Best Practice
- Keep interfaces in `*.Domain.Interfaces` namespace
- Keep implementations in `*.Services` namespace
- Always add both namespaces if you use both

---

### 4. **Nested Dictionary Initialization Errors** ??

#### Error Example
```csharp
// PROBLEMATIC: Unclear nesting structure
Data = new Dictionary<string, object>
{
    { "stats", new Dictionary<string, object>
        {
            { "debatesJoined", 28 },
            { "amendmentsOffered", 12 },
            { "floorTimeMinutes", 142 }
        }  // ? Missing closing brace alignment issue
    }
}
```

#### Correct Implementation
```csharp
// CORRECT: Clear nesting with proper indentation
Data = new Dictionary<string, object>
{
    { "stats", new Dictionary<string, object>
    {
        { "debatesJoined", 28 },
        { "amendmentsOffered", 12 },
        { "floorTimeMinutes", 142 }
    } },  // ? Proper alignment and closure
    { "totalItems", 3 }
}
```

---

### 5. **Missing Using Directives** ??

#### Error Example
```csharp
// WRONG: Missing ILogger using directive
public class IngestionController : ControllerBase
{
    private readonly ILogger<IngestionController> _logger;  // ? Error: ILogger not found
}
```

#### Error Message
```
CS0246: The type or namespace name 'ILogger' could not be found
```

#### Correct Implementation
```csharp
using Microsoft.Extensions.Logging;  // ? Add this
using Microsoft.AspNetCore.Mvc;

public class IngestionController : ControllerBase
{
    private readonly ILogger<IngestionController> _logger;  // ? Now it works
}
```

#### Common Missing Directives Checklist
```csharp
// Logging
using Microsoft.Extensions.Logging;

// ASP.NET Core
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

// Dependency Injection
using Microsoft.Extensions.DependencyInjection;

// Domain Models
using PoliTickIt.Domain.Models;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Infrastructure.Persistence;

// Ingestion Services
using PoliTickIt.Ingestion.Services;
using PoliTickIt.Ingestion.Providers;
```

---

## Root Causes

### Primary Causes of Syntax Errors

| Cause | Impact | Prevention |
|-------|--------|-----------|
| **Copy-paste errors** | Trailing commas, mismatched braces | Use IDE templates, code generation |
| **Incomplete refactoring** | Missing using directives | Use "Organize Usings" feature |
| **Stale builds** | Missing metadata files | Regular `dotnet clean && dotnet restore` |
| **Inconsistent formatting** | Hidden syntax issues | Use `.editorconfig` and code formatters |
| **Manual data structure edits** | Dictionary initialization errors | Use builder patterns or JSON serialization |
| **Namespace confusion** | Type not found errors | Maintain clear namespace hierarchy |
| **Incomplete IDE updates** | IntelliSense not catching errors | Restart IDE, reload projects |

---

## Prevention Strategies

### 1. **Use EditorConfig for Consistency** ??

Create `.editorconfig` file in the root of the solution:

```ini
# Root EditorConfig file
root = true

# C# files
[*.cs]

# Indentation and spacing
indent_size = 4
indent_style = space
tab_width = 4

# Newline preferences
csharp_new_line_before_open_brace = all
csharp_new_line_before_else = true
csharp_new_line_before_catch = true
csharp_new_line_before_finally = true
csharp_new_line_before_members_in_object_initializers = true
csharp_new_line_before_members_in_anonymous_types = true

# Spacing
csharp_space_after_cast = false
csharp_space_after_keywords_in_control_flow_statements = true
csharp_space_between_method_call_parameter_lists = false

# Naming conventions
dotnet_naming_rule.private_fields_style.severity = suggestion
dotnet_naming_rule.private_fields_style.symbols = private_fields
dotnet_naming_rule.private_fields_style.style = private_field_style

dotnet_naming_symbols.private_fields.applicable_kinds = field
dotnet_naming_symbols.private_fields.applicable_accessibilities = private
dotnet_naming_style.private_field_style.required_prefix = _
dotnet_naming_style.private_field_style.capitalization = camel_case
```

### 2. **Implement Code Analysis Rules** ??

Add to `.csproj` files:

```xml
<PropertyGroup>
  <EnableNETAnalyzers>true</EnableNETAnalyzers>
  <AnalysisLevel>latest</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

### 3. **Use Builder Pattern for Complex Objects** ???

Instead of inline initialization:

```csharp
// ? AVOID: Error-prone inline initialization
var snap = new PoliSnap
{
    Id = "test",
    Data = new Dictionary<string, object>
    {
        { "nested", new Dictionary<string, object> { /* ... */ } }  // Prone to errors
    }
};

// ? PREFER: Builder pattern
var snap = new SnapBuilder()
    .WithId("test")
    .WithTitle("Test Snap")
    .AddElement(new ElementBuilder()
        .WithId("elem-1")
        .WithType("Header")
        .Build())
    .Build();
```

### 4. **Automated Code Formatting** ??

Configure Visual Studio/VS Code:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "ms-dotnettools.csharp",
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.style": true,
      "source.organizeImports": true
    }
  }
}
```

### 5. **Template Generation Script** ??

Create PowerShell script for consistent boilerplate:

```powershell
# Generate new provider template
param(
    [Parameter(Mandatory=$true)]
    [string]$ProviderName
)

$template = @"
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PoliTickIt.Domain.Interfaces;
using PoliTickIt.Domain.Models;

namespace PoliTickIt.Ingestion.Providers;

/// <summary>
/// Data Provider: $ProviderName
/// </summary>
public class ${ProviderName}Provider : IDataSourceProvider
{
    public string ProviderName => "$ProviderName";

    public async Task<IEnumerable<PoliSnap>> FetchLatestSnapsAsync()
    {
        // Implementation here
        return await Task.FromResult(new List<PoliSnap>());
    }
}
"@

$template | Out-File -FilePath "PoliTickIt.Ingestion/Providers/${ProviderName}Provider.cs" -Encoding UTF8
```

---

## Quick Reference

### Dictionary Syntax Checklist ?

```csharp
// ? Correct: Each entry is a key-value PAIR
Data = new Dictionary<string, object>
{
    { "key1", "value1" },      // ? Comma after complete pair
    { "key2", "value2" },      // ? Comma after complete pair
    { "key3", "value3" }       // ? NO comma on last pair
};

// ? Correct: Nested dictionary
Data = new Dictionary<string, object>
{
    { "outer", new Dictionary<string, object>
    {
        { "inner1", "value1" },
        { "inner2", "value2" }
    } }  // ? Closing braces with proper alignment
};

// ? WRONG: Comma after VALUE instead of pair
Data = new Dictionary<string, object>
{
    { "key", "value", }  // ? This comma is WRONG
};

// ? WRONG: Missing closing brace
Data = new Dictionary<string, object>
{
    { "key", new Dictionary<string, object>
    {
        { "nested", "value" }
    }  // ? Missing final closing brace
};
```

### Build and Restore Commands ???

```powershell
# Clean and restore
dotnet clean
dotnet restore

# Build all
dotnet build

# Build specific project
dotnet build PoliTickIt.Api/PoliTickIt.Api.csproj

# Force rebuild
dotnet build --no-cache

# Run tests
dotnet test

# Format code
dotnet format
```

### IDE Keyboard Shortcuts ??

| Action | Visual Studio | VS Code |
|--------|---------------|---------|
| Format Document | Ctrl+K, Ctrl+D | Shift+Alt+F |
| Organize Usings | Ctrl+R, Ctrl+G | N/A (use extension) |
| Reload Project | Right-click ? Reload | Ctrl+Shift+P ? Reload |
| Go to Definition | F12 | F12 |
| Find References | Shift+F12 | Shift+Alt+F12 |
| Build Solution | Ctrl+Shift+B | Ctrl+Shift+B |
| Clean Solution | Build ? Clean | N/A |

---

## Error Recovery

### Step-by-Step Recovery Process ??

#### If you see: `CS0246: Type or namespace not found`
```csharp
// Step 1: Check using directives
using PoliTickIt.Domain.Interfaces;  // ? Add missing namespace

// Step 2: Verify the type exists
// ? Search: Ctrl+F "IIngestionService" across solution

// Step 3: Check project references
// ? Right-click project ? Add Reference ? Select project
```

#### If you see: `CS1525: Invalid expression term '}'`
```csharp
// Step 1: Check for trailing commas
{ "key", "value", }  // ? Remove this comma

// Step 2: Verify brace matching
// ? Use IDE's brace matching (Ctrl+Shift+\)

// Step 3: Check nested structures
// ? Ensure all opening { have closing }
```

#### If you see: `CS0006: Metadata file not found`
```powershell
# Step 1: Clean project
dotnet clean

# Step 2: Restore packages
dotnet restore

# Step 3: Rebuild
dotnet build

# Step 4: If still failing, reload IDE
# ? Visual Studio: File ? Reload Solution
# ? VS Code: Ctrl+Shift+P ? Reload Window
```

#### If you see: `Error in File: ... CSC`
```powershell
# This indicates a compilation-time issue. Follow steps:

# 1. Check for orphaned obj/bin directories
Remove-Item -Recurse -Force "bin", "obj"

# 2. Full restore and build
dotnet clean
dotnet restore
dotnet build

# 3. If persists, reload IDE or restart machine
```

---

## Best Practices for Data Structure Definition

### Example: Proper PoliSnap Element Definition

```csharp
// ? CORRECT: Well-formatted, easy to review
new SnapElement
{
    Id = "element-1",
    Type = "Metric.Attendance.Grid",
    DisplayName = "Attendance Heatmap",
    Data = new Dictionary<string, object>
    {
        { "presenceRate", 0.985 },
        { "totalSessions", 142 },
        { "attended", 140 },
        { "missed", 2 },
        { "trend", "Stable" }
    },
    Provenance = new ProvenanceMetadata
    {
        Provider = "Official Senate Journal",
        IsVerified = true,
        Timestamp = DateTime.UtcNow
    }
}
```

### Example: Nested Dictionary Pattern

```csharp
// ? CORRECT: Proper indentation and alignment
Data = new Dictionary<string, object>
{
    { "stats", new Dictionary<string, object>
    {
        { "debatesJoined", 28 },
        { "amendmentsOffered", 12 },
        { "floorTimeMinutes", 142 }
    } },
    { "totalItems", 3 },
    { "timestamp", DateTime.UtcNow }
}
```

---

## Appendix: Common Error Messages Reference

| Error Code | Message | Common Cause | Solution |
|-----------|---------|--------------|----------|
| CS0246 | Type or namespace not found | Missing using directive | Add `using` statement or check project reference |
| CS1525 | Invalid expression term | Syntax error (trailing comma, mismatched braces) | Review dictionary/collection syntax |
| CS0006 | Metadata file not found | Stale build artifacts | `dotnet clean && dotnet restore && dotnet build` |
| CS0117 | No definition for member | Using type from wrong namespace | Check namespace and imports |
| CS1514 | `{` expected | Missing opening brace | Check brace matching |
| CS1513 | `}` expected | Missing closing brace | Check brace matching |

---

## Document Maintenance

**Last Updated:** 2026-01-30  
**Next Review:** 2026-02-15  
**Maintained By:** PoliTickIt Development Team  
**Version History:**
- v1.0 (2026-01-30): Initial document creation with common error patterns

---

## Contact & Questions

For questions or updates to this guide:
1. Create an issue in the repository
2. Reference this document in PR reviews
3. Update with new error patterns as they occur
4. Share learnings across mobile and backend teams

---

**End of Document**
