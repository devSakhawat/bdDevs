using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("DmsDocument")]
public partial class DmsDocument
{
    [Key]
    public int DocumentId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [StringLength(255)]
    public string FileName { get; set; } = null!;

    [StringLength(10)]
    public string FileExtension { get; set; } = null!;

    public long FileSize { get; set; }

    public string FilePath { get; set; } = null!;

    public DateTime? UploadDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UploadedByUserId { get; set; }

    public int DocumentTypeId { get; set; }

    [StringLength(50)]
    public string? ReferenceEntityType { get; set; }

    [StringLength(50)]
    public string? ReferenceEntityId { get; set; }

    public int? FolderId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? SystemTag { get; set; }

    public int? CurrentEntityId { get; set; }

    [InverseProperty("Document")]
    public virtual ICollection<DmsDocumentAccessLog> DmsDocumentAccessLogs { get; set; } = new List<DmsDocumentAccessLog>();

    [InverseProperty("Document")]
    public virtual ICollection<DmsDocumentTagMap> DmsDocumentTagMaps { get; set; } = new List<DmsDocumentTagMap>();

    [InverseProperty("Document")]
    public virtual ICollection<DmsDocumentVersion> DmsDocumentVersions { get; set; } = new List<DmsDocumentVersion>();

    [ForeignKey("DocumentTypeId")]
    [InverseProperty("DmsDocuments")]
    public virtual DmsDocumentType DocumentType { get; set; } = null!;
}
