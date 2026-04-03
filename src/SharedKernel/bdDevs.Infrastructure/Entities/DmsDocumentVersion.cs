using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentVersion")]
[Index("DocumentId", "VersionNumber", Name = "UQ_DocumentVersion_DocumentId_VersionNumber", IsUnique = true)]
public partial class DmsDocumentVersion
{
    [Key]
    public int VersionId { get; set; }

    public int DocumentId { get; set; }

    public int VersionNumber { get; set; }

    [StringLength(255)]
    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public DateTime? UploadedDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UploadedBy { get; set; }

    public bool? IsCurrentVersion { get; set; }

    public string? VersionNotes { get; set; }

    public int? PreviousVersionId { get; set; }

    public long? FileSize { get; set; }

    [ForeignKey("DocumentId")]
    [InverseProperty("DmsDocumentVersions")]
    public virtual DmsDocument Document { get; set; } = null!;
}
