namespace bdDevs.Api.Metadata;

public static class MetadataSeeder
{
	// This is a non-destructive stub intended to be invoked manually.
	// It should be extended later to scan DbContext and upsert metadata.
	public static void RunSeed()
	{
		Console.WriteLine("MetadataSeeder: stub run - no changes performed.");
		// Implementation note: scan EF Core DbContext types, build FieldMetadata rows, upsert while preserving overrides.
	}
}
