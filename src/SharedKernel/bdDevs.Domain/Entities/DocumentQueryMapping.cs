using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("DocumentQueryMapping")]
[Index("DocumentTypeId", "ReportHeaderId", Name = "IX_DocumentQueryMapping", IsUnique = true)]
public partial class DocumentQueryMapping
{
    [Key]
    public int DocumentQueryId { get; set; }

    public int ReportHeaderId { get; set; }

    public int DocumentTypeId { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? ParameterDefination { get; set; }
}
