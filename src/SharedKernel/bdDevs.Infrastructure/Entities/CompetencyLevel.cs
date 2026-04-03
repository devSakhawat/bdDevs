using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CompetencyLevel")]
public partial class CompetencyLevel
{
    [Key]
    public int LevelId { get; set; }

    [StringLength(50)]
    public string? LevelTitle { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? Remarks { get; set; }
}
