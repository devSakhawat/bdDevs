namespace bdDevs.Contracts.Responses;


public class StandardApiResponse<T>
{
	public bool Success { get; init; }
	public T? Data { get; init; }
	public PaginationMetadata? Pagination { get; init; }
	public List<LinkDto> Links { get; init; } = [];
	public List<FieldError> Errors { get; init; } = [];
	public string? CorrelationId { get; init; }
	public string Version { get; init; } = "1.0";
	public DateTime Timestamp { get; init; } = DateTime.UtcNow;

	public static StandardApiResponse<T> Ok(T data, string? correlationId = null) =>
			new() { Success = true, Data = data, CorrelationId = correlationId };

	public static StandardApiResponse<T> OkGrid(
			T data,
			PaginationMetadata pagination,
			List<LinkDto>? links = null,
			string? correlationId = null) =>
			new()
			{
				Success = true,
				Data = data,
				Pagination = pagination,
				Links = links ?? [],
				CorrelationId = correlationId
			};

	public static StandardApiResponse<T> Fail(List<FieldError> errors, string? correlationId = null) =>
			new() { Success = false, Errors = errors, CorrelationId = correlationId };

	public static StandardApiResponse<T> Fail(string field, string message, string? correlationId = null) =>
			Fail([new FieldError(field, message)], correlationId);
}