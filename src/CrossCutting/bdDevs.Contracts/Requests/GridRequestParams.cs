namespace bdDevs.Contracts.Requests;

public class GridRequestParams
{
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 20;
	public string? Sort { get; set; }
	public string? Dir { get; set; } = "asc";
	public string? Search { get; set; }

	public int Skip => (Page - 1) * PageSize;
}


