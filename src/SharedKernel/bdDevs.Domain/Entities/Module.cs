using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("Module")]
public partial class Module
{
    [Key]
    public int ModuleId { get; set; }

    [StringLength(50)]
    public string ModuleName { get; set; } = null!;
}
