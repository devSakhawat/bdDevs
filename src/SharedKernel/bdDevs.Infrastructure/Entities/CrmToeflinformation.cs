using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmTOEFLInformation")]
public partial class CrmToeflinformation
{
    [Key]
    [Column("TOEFLInformationId")]
    public int ToeflinformationId { get; set; }

    public int ApplicantId { get; set; }

    [Column("TOEFLListening", TypeName = "decimal(18, 2)")]
    public decimal? Toefllistening { get; set; }

    [Column("TOEFLReading", TypeName = "decimal(18, 2)")]
    public decimal? Toeflreading { get; set; }

    [Column("TOEFLWriting", TypeName = "decimal(18, 2)")]
    public decimal? Toeflwriting { get; set; }

    [Column("TOEFLSpeaking", TypeName = "decimal(18, 2)")]
    public decimal? Toeflspeaking { get; set; }

    [Column("TOEFLOverallScore", TypeName = "decimal(18, 2)")]
    public decimal? ToefloverallScore { get; set; }

    [Column("TOEFLDate", TypeName = "datetime")]
    public DateTime? Toefldate { get; set; }

    [Column("TOEFLScannedCopyPath")]
    [StringLength(350)]
    public string? ToeflscannedCopyPath { get; set; }

    [Column("TOEFLAdditionalInformation")]
    [Unicode(false)]
    public string? ToefladditionalInformation { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [ForeignKey("ApplicantId")]
    [InverseProperty("CrmToeflinformations")]
    public virtual CrmApplication Applicant { get; set; } = null!;
}
