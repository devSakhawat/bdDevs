using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmApplicantInfo")]
public partial class CrmApplicantInfo
{
    [Key]
    public int ApplicantId { get; set; }

    public int ApplicationId { get; set; }

    public int GenderId { get; set; }

    [StringLength(50)]
    public string? TitleValue { get; set; }

    [StringLength(50)]
    public string? TitleText { get; set; }

    [StringLength(100)]
    public string? FirstName { get; set; }

    [StringLength(100)]
    public string? LastName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateOfBirth { get; set; }

    public int MaritalStatusId { get; set; }

    [StringLength(100)]
    public string? Nationality { get; set; }

    public bool? HasValidPassport { get; set; }

    [StringLength(50)]
    public string? PassportNumber { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PassportIssueDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PassportExpiryDate { get; set; }

    [StringLength(10)]
    public string? PhoneCountryCode { get; set; }

    [StringLength(10)]
    public string? PhoneAreaCode { get; set; }

    [StringLength(25)]
    public string? PhoneNumber { get; set; }

    [StringLength(20)]
    public string? Mobile { get; set; }

    [StringLength(150)]
    public string? EmailAddress { get; set; }

    [StringLength(100)]
    public string? SkypeId { get; set; }

    public string? ApplicantImagePath { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicationId")]
    [InverseProperty("CrmApplicantInfos")]
    public virtual CrmApplication Application { get; set; } = null!;
}
