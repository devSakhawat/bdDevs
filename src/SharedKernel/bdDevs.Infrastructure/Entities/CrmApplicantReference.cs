using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmApplicantReference")]
public partial class CrmApplicantReference
{
    [Key]
    public int ApplicantReferenceId { get; set; }

    public int ApplicantId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    public string? Designation { get; set; }

    [StringLength(255)]
    public string? Institution { get; set; }

    [Column("EmailID")]
    [StringLength(150)]
    public string? EmailId { get; set; }

    [StringLength(50)]
    public string? PhoneNo { get; set; }

    [StringLength(50)]
    public string? FaxNo { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    public int? CountryId { get; set; }

    [StringLength(20)]
    public string? PostOrZipCode { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmApplicantReferences")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
