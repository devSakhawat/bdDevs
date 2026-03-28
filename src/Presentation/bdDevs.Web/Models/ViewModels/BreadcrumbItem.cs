namespace bdDevs.Web.Models.ViewModels;

public class BreadcrumbItem
{
	public string Label { get; }
	public string? Url { get; }

	public BreadcrumbItem(string label, string? url = null)
	{
		Label = label;
		Url = url;
	}
}