using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("Company")]
public partial class Company
{
    [Key]
    public int CompanyId { get; set; }

    [StringLength(50)]
    public string? CompanyCode { get; set; }

    [StringLength(50)]
    public string CompanyName { get; set; } = null!;

    [StringLength(1000)]
    public string? Address { get; set; }

    [StringLength(50)]
    public string? Phone { get; set; }

    [StringLength(50)]
    public string? Fax { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(1000)]
    public string? FullLogoPath { get; set; }

    [StringLength(50)]
    public string? PrimaryContact { get; set; }

    public int Flag { get; set; }

    public int FiscalYearStart { get; set; }

    public int? MotherId { get; set; }

    public int? IsCostCentre { get; set; }

    public int? IsActive { get; set; }

    public DateOnly? GratuityStartDate { get; set; }

    [StringLength(1000)]
    public string? FullLogoPathForReport { get; set; }

    [StringLength(50)]
    public string? CompanyTin { get; set; }

    public bool? IsPfApplicable { get; set; }

    public bool? IsEwfApplicable { get; set; }

    public int? IsPfApplicabe { get; set; }

    public int? IsEwfApplicabe { get; set; }

    [StringLength(50)]
    public string? CompanyAlias { get; set; }

    [StringLength(200)]
    public string? CompanyZone { get; set; }

    [StringLength(200)]
    public string? CompanyCircle { get; set; }

    public int? IsCompanyContributionDisable { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    [Column("IsELAutoAddedForCurrentYear")]
    public int? IsElautoAddedForCurrentYear { get; set; }

    public int? IsRosterAutoCarryForward { get; set; }

    [StringLength(1000)]
    public string? LetterHeader { get; set; }

    [StringLength(1000)]
    public string? LetterFooter { get; set; }

    [StringLength(250)]
    public string? CompanyRegisterNo { get; set; }

    public int? CompanySortOrder { get; set; }

    public int? CompanyAccessGroupNo { get; set; }

    public int? IsSentGreetingsOrWishNotification { get; set; }

    public int? IsNotifyForNextMonIncEligible { get; set; }
}
