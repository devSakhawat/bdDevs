using bdDevs.Contracts.Responses;

namespace bdDevs.Contracts.Interfaces;

public interface ILinkFactory<in T>
{
	List<LinkDto> GetLinks(T resource);
}