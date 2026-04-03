namespace bdDevs.Contracts.Responses;

public class MenuDto
{
    public int MenuId { get; set; }
    public int ModuleId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public string? MenuPath { get; set; }
    public int? ParentMenu { get; set; }
    public int? Sororder { get; set; }
    public int? Todo { get; set; }
    public int? IsActive { get; set; }
}
