using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmGMATInformation")]
public partial class CrmGmatinformation
{
    [Key]
    [Column("GMATInformationId")]
    public int GmatinformationId { get; set; }

    public int ApplicantId { get; set; }

    [Column("GMATListening", TypeName = "decimal(18, 2)")]
    public decimal? Gmatlistening { get; set; }

    [Column("GMATReading", TypeName = "decimal(18, 2)")]
    public decimal? Gmatreading { get; set; }

    [Column("GMATWriting", TypeName = "decimal(18, 2)")]
    public decimal? Gmatwriting { get; set; }

    [Column("GMATSpeaking", TypeName = "decimal(18, 2)")]
    public decimal? Gmatspeaking { get; set; }

    [Column("GMATOverallScore", TypeName = "decimal(18, 2)")]
    public decimal? GmatoverallScore { get; set; }

    [Column("GMATDate", TypeName = "datetime")]
    public DateTime? Gmatdate { get; set; }

    [Column("GMATScannedCopyPath")]
    [StringLength(350)]
    public string? GmatscannedCopyPath { get; set; }

    [Column("GMATAdditionalInformation")]
    public string? GmatadditionalInformation { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmGmatinformations")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
