using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("DocumentTemplate")]
[Index("TemplateName", Name = "IX_DocumentTemplate", IsUnique = true)]
public partial class DocumentTemplate
{
    [Key]
    public int DocumentId { get; set; }

    [StringLength(200)]
    public string DocumentTitle { get; set; } = null!;

    [Unicode(false)]
    public string? DocumentText { get; set; }

    [StringLength(100)]
    public string TemplateName { get; set; } = null!;

    public int? DocumentTypeId { get; set; }
}
