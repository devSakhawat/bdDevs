using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Index("ParentId", Name = "IX_Menus_ParentId")]
public partial class Menu
{
    [Key]
    public int Id { get; set; }

    public int? ParentId { get; set; }

    [StringLength(100)]
    public string Title { get; set; } = null!;

    [StringLength(100)]
    public string? Icon { get; set; }

    [StringLength(200)]
    public string? Url { get; set; }

    public int? PermissionId { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; }

    [InverseProperty("Parent")]
    public virtual ICollection<Menu> InverseParent { get; set; } = new List<Menu>();

    [ForeignKey("ParentId")]
    [InverseProperty("InverseParent")]
    public virtual Menu? Parent { get; set; }

    [ForeignKey("PermissionId")]
    [InverseProperty("Menus")]
    public virtual Permission? Permission { get; set; }
}
