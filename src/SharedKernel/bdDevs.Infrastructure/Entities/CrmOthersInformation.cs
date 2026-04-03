using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmOthersInformation")]
public partial class CrmOthersInformation
{
    [Key]
    public int OthersInformationId { get; set; }

    public int ApplicantId { get; set; }

    public string? AdditionalInformation { get; set; }

    [StringLength(255)]
    public string? OthersScannedCopyPath { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmOthersInformations")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
