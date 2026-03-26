namespace bdDevs.Contracts.Responses;

public class LinkedResource<T>
{
	public T Data { get; init; }
	public List<LinkDto> Links { get; init; } = [];

	public LinkedResource(T data, List<LinkDto> links)
	{
		Data = data;
		Links = links;
	}
}
