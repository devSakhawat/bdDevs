using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("WfState")]
public partial class WfState
{
    [Key]
    [Column("WFStateId")]
    public int WfstateId { get; set; }

    [StringLength(50)]
    public string StateName { get; set; } = null!;

    public int MenuId { get; set; }

    public bool? IsDefaultStart { get; set; }

    public int? IsClosed { get; set; }

    [Column("sequence")]
    public int? Sequence { get; set; }
}
