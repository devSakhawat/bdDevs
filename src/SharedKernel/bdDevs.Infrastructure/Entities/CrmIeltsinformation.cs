using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmIELTSInformation")]
public partial class CrmIeltsinformation
{
    [Key]
    [Column("IELTSInformationId")]
    public int IeltsinformationId { get; set; }

    public int ApplicantId { get; set; }

    [Column("IELTSListening", TypeName = "decimal(18, 2)")]
    public decimal? Ieltslistening { get; set; }

    [Column("IELTSReading", TypeName = "decimal(18, 2)")]
    public decimal? Ieltsreading { get; set; }

    [Column("IELTSWriting", TypeName = "decimal(18, 2)")]
    public decimal? Ieltswriting { get; set; }

    [Column("IELTSSpeaking", TypeName = "decimal(18, 2)")]
    public decimal? Ieltsspeaking { get; set; }

    [Column("IELTSOverallScore", TypeName = "decimal(18, 2)")]
    public decimal? IeltsoverallScore { get; set; }

    [Column("IELTSDate", TypeName = "datetime")]
    public DateTime? Ieltsdate { get; set; }

    [Column("IELTSScannedCopyPath")]
    [StringLength(350)]
    public string? IeltsscannedCopyPath { get; set; }

    [Column("IELTSAdditionalInformation")]
    [Unicode(false)]
    public string? IeltsadditionalInformation { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmIeltsinformations")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
