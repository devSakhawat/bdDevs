using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

/// <summary>
/// Stores intake years for CRM applications
/// </summary>
[Table("CrmIntakeYear")]
[Index("IsActive", Name = "IX_CrmIntakeYear_Status")]
[Index("YearValue", Name = "IX_CrmIntakeYear_YearValue")]
public partial class CrmIntakeYear
{
    [Key]
    public int IntakeYearId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string YearName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? YearCode { get; set; }

    public int YearValue { get; set; }

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
