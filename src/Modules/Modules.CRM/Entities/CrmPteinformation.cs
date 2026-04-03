using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmPTEInformation")]
public partial class CrmPteinformation
{
    [Key]
    [Column("PTEInformationId")]
    public int PteinformationId { get; set; }

    public int ApplicantId { get; set; }

    [Column("PTEListening", TypeName = "decimal(18, 2)")]
    public decimal? Ptelistening { get; set; }

    [Column("PTEReading", TypeName = "decimal(18, 2)")]
    public decimal? Ptereading { get; set; }

    [Column("PTEWriting", TypeName = "decimal(18, 2)")]
    public decimal? Ptewriting { get; set; }

    [Column("PTESpeaking", TypeName = "decimal(18, 2)")]
    public decimal? Ptespeaking { get; set; }

    [Column("PTEOverallScore", TypeName = "decimal(18, 2)")]
    public decimal? PteoverallScore { get; set; }

    [Column("PTEDate", TypeName = "datetime")]
    public DateTime? Ptedate { get; set; }

    [Column("PTEScannedCopyPath")]
    [StringLength(350)]
    public string? PtescannedCopyPath { get; set; }

    [Column("PTEAdditionalInformation")]
    public string? PteadditionalInformation { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmPteinformations")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
