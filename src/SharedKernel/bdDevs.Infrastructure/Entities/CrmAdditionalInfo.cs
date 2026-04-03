using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmAdditionalInfo")]
public partial class CrmAdditionalInfo
{
    [Key]
    public int AdditionalInfoId { get; set; }

    public int ApplicantId { get; set; }

    public bool? RequireAccommodation { get; set; }

    [Column("HealthNMedicalNeeds")]
    public bool? HealthNmedicalNeeds { get; set; }

    [Column("HealthNMedicalNeedsRemarks")]
    public string? HealthNmedicalNeedsRemarks { get; set; }

    public string? AdditionalInformationRemarks { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmAdditionalInfos")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
