using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("ReportBuilder")]
public partial class ReportBuilder
{
    [Key]
    public int ReportHeaderId { get; set; }

    [StringLength(250)]
    public string? ReportHeader { get; set; }

    [StringLength(250)]
    public string? ReportTitle { get; set; }

    public int? QueryType { get; set; }

    public string? QueryText { get; set; }

    public int? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? OrderByColumn { get; set; }
}
