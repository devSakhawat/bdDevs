namespace bdDevs.Contracts.Responses;

public class PaginationMetadata
{
	public int CurrentPage { get; init; }
	public int PageSize { get; init; }
	public int TotalCount { get; init; }
	public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
	public bool HasPrevious => CurrentPage > 1;
	public bool HasNext => CurrentPage < TotalPages;
}