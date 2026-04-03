using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmEducationHistory")]
public partial class CrmEducationHistory
{
    [Key]
    public int EducationHistoryId { get; set; }

    public int ApplicantId { get; set; }

    [StringLength(255)]
    public string? Institution { get; set; }

    [StringLength(100)]
    public string? Qualification { get; set; }

    public int? PassingYear { get; set; }

    [StringLength(50)]
    public string? Grade { get; set; }

    [StringLength(255)]
    public string? DocumentPath { get; set; }

    [StringLength(255)]
    public string? DocumentName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmEducationHistories")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
