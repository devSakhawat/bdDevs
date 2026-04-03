using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

/// <summary>
/// Stores intake months for CRM applications
/// </summary>
[Table("CrmIntakeMonth")]
[Index("MonthNumber", Name = "IX_CrmIntakeMonth_MonthNumber")]
[Index("IsActive", Name = "IX_CrmIntakeMonth_Status")]
public partial class CrmIntakeMonth
{
    [Key]
    public int IntakeMonthId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string MonthName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? MonthCode { get; set; }

    public int MonthNumber { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }
}
