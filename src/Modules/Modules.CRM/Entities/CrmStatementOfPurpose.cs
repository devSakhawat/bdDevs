using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmStatementOfPurpose")]
public partial class CrmStatementOfPurpose
{
    [Key]
    public int StatementOfPurposeId { get; set; }

    public int ApplicantId { get; set; }

    public string? StatementOfPurposeRemarks { get; set; }

    [StringLength(255)]
    public string? StatementOfPurposeFilePath { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }
}
