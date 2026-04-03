using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmWorkExperience")]
public partial class CrmWorkExperience
{
    [Key]
    public int WorkExperienceId { get; set; }

    public int ApplicantId { get; set; }

    [StringLength(255)]
    public string? NameOfEmployer { get; set; }

    [StringLength(100)]
    public string? Position { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Period { get; set; }

    public string? MainResponsibility { get; set; }

    [StringLength(350)]
    public string? ScannedCopyPath { get; set; }

    [StringLength(255)]
    public string? DocumentName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmWorkExperiences")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
