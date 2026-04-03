using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmCourse")]
public partial class CrmCourse
{
    [Key]
    public int CourseId { get; set; }

    public int InstituteId { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? CourseTitle { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CourseLevel { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? CourseFee { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ApplicationFee { get; set; }

    public int? CurrencyId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MonthlyLivingCost { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? PartTimeWorkDetails { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? CourseBenefits { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? LanguagesRequirement { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CourseDuration { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CourseCategory { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? AwardingBody { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? AdditionalInformationOfCourse { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? GeneralEligibility { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? FundsRequirementforVisa { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InstitutionalBenefits { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? VisaRequirement { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? CountryBenefits { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? KeyModules { get; set; }

    public bool? Status { get; set; }

    [Column("After2YearsPSWCompletingCourse")]
    [StringLength(300)]
    [Unicode(false)]
    public string? After2YearsPswcompletingCourse { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DocumentId { get; set; }
}
