using System.ComponentModel.DataAnnotations;

namespace bdDevs.Contracts.Requests;

public class UpdateMenuRequest
{
    [Required]
    public int MenuId { get; set; }

    [Required]
    public int ModuleId { get; set; }

    [Required]
    [StringLength(50)]
    public string MenuName { get; set; } = string.Empty;

    [StringLength(200)]
    public string? MenuPath { get; set; }

    public int? ParentMenu { get; set; }

    public int? Sororder { get; set; }

    public int? Todo { get; set; }

    public int? IsActive { get; set; }
}
