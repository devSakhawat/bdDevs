using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentType")]
public partial class DmsDocumentType
{
    [Key]
    public int DocumentTypeId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string DocumentType { get; set; } = null!;

    public bool IsMandatory { get; set; }

    [StringLength(255)]
    public string? AcceptedExtensions { get; set; }

    [Column("MaxFileSizeMB")]
    public int? MaxFileSizeMb { get; set; }

    [InverseProperty("DocumentType")]
    public virtual ICollection<DmsDocument> DmsDocuments { get; set; } = new List<DmsDocument>();
}
