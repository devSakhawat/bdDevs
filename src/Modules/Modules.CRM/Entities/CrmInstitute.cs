using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmInstitute")]
public partial class CrmInstitute
{
    [Key]
    public int InstituteId { get; set; }

    public int CountryId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string InstituteName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? Campus { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Website { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MonthlyLivingCost { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? FundsRequirementforVisa { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ApplicationFee { get; set; }

    public int? CurrencyId { get; set; }

    public bool? IsLanguageMandatory { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? LanguagesRequirement { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InstitutionalBenefits { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? PartTimeWorkDetails { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? ScholarshipsPolicy { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InstitutionStatusNotes { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? InstitutionLogo { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InstitutionProspectus { get; set; }

    public int? InstituteTypeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? InstituteCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? InstituteEmail { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? InstituteAddress { get; set; }

    [Column("InstitutePhoneNO")]
    [StringLength(20)]
    [Unicode(false)]
    public string? InstitutePhoneNo { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? InstituteMobileNo { get; set; }

    public bool? Status { get; set; }
}
