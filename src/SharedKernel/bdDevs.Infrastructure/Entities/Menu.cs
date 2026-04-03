using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Menu")]
public partial class Menu
{
    [Key]
    [Column("MenuID")]
    public int MenuId { get; set; }

    [Column("ModuleID")]
    public int ModuleId { get; set; }

    [StringLength(50)]
    public string MenuName { get; set; } = null!;

    [StringLength(200)]
    public string? MenuPath { get; set; }

    public int? ParentMenu { get; set; }

    [Column("SORORDER")]
    public int? Sororder { get; set; }

    [Column("TODO")]
    public int? Todo { get; set; }

    public int? IsActive { get; set; }
}
