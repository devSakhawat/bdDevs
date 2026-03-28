using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Contracts.Responses;

public class MenuItemDto
{
	public int Id { get; init; }
	public string Title { get; init; } = "";
	public string? Icon { get; init; }
	public string? Url { get; init; }
	public int SortOrder { get; init; }
	public List<MenuItemDto> Children { get; init; } = [];

	public bool HasChildren => Children.Count > 0;
	public bool IsGroup => string.IsNullOrEmpty(Url);
}
