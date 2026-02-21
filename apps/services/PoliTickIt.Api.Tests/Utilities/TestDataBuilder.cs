using PoliTickIt.Domain.Models;

namespace PoliTickIt.Api.Tests.Utilities;

public static class TestDataBuilder
{
    public static PoliSnap BuildTestSnap(
        string id = "test-snap-1",
        string sku = "TEST-SKU",
        string title = "Test Snap",
        string type = "TestType")
    {
        return new PoliSnap
        {
            Id = id,
            Sku = sku,
            Title = title,
            Type = type,
            CreatedAt = DateTime.UtcNow,
            Sources = new List<Source>
            {
                new Source { Name = "Test Source", Url = "https://test.com" }
            },
            Metadata = new SnapMetadata
            {
                PolicyArea = "Test Policy",
                InsightType = "TestInsight",
                Description = "Test Description",
                Keywords = new List<string> { "test", "keyword" }
            },
            Elements = new List<SnapElement>
            {
                new SnapElement
                {
                    Id = "elem-1",
                    Type = "Metric",
                    DisplayName = "Test Metric",
                    Data = new Dictionary<string, object> { { "value", "100" } }
                }
            }
        };
    }

    public static List<PoliSnap> BuildTestSnaps(int count = 3)
    {
        return Enumerable.Range(1, count)
            .Select(i => BuildTestSnap(
                id: $"test-snap-{i}",
                sku: $"TEST-SKU-{i}",
                title: $"Test Snap {i}",
                type: $"Type{i}"))
            .ToList();
    }
}
