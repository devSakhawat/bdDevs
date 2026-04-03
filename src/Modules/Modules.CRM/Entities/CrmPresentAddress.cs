using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmPresentAddress")]
public partial class CrmPresentAddress
{
    [Key]
    public int PresentAddressId { get; set; }

    public int ApplicantId { get; set; }

    public bool SameAsPermanentAddress { get; set; }

    [StringLength(255)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    public int CountryId { get; set; }

    [StringLength(20)]
    public string? PostalCode { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmPresentAddresses")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
