using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmApplicantCourse")]
public partial class CrmApplicantCourse
{
    [Key]
    public int ApplicantCourseId { get; set; }

    public int ApplicantId { get; set; }

    public int CountryId { get; set; }

    [StringLength(100)]
    public string? CountryName { get; set; }

    public int InstituteId { get; set; }

    [StringLength(255)]
    public string? CourseTitle { get; set; }

    public int IntakeMonthId { get; set; }

    [StringLength(50)]
    public string? IntakeMonth { get; set; }

    public int IntakeYearId { get; set; }

    [StringLength(50)]
    public string? IntakeYear { get; set; }

    [StringLength(50)]
    public string? ApplicationFee { get; set; }

    public int CurrencyId { get; set; }

    public int PaymentMethodId { get; set; }

    [StringLength(50)]
    public string? PaymentMethod { get; set; }

    [StringLength(100)]
    public string? PaymentReferenceNumber { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PaymentDate { get; set; }

    public string? Remarks { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public int? CourseId { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmApplicantCourses")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
