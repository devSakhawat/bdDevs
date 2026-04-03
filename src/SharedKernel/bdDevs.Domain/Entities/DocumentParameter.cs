using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("DocumentParameter")]
public partial class DocumentParameter
{
    [Key]
    public int ParameterId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string ParameterName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string ParameterKey { get; set; } = null!;

    [Column("Control_Role")]
    [StringLength(50)]
    [Unicode(false)]
    public string? ControlRole { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? DataSource { get; set; }

    public int? ControlSequence { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DataTextField { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DataValueField { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CaseCading { get; set; }
}
