using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentFolder")]
public partial class DmsDocumentFolder
{
    [Key]
    public int FolderId { get; set; }

    public int? ParentFolderId { get; set; }

    [StringLength(255)]
    public string FolderName { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? OwnerId { get; set; }

    [StringLength(150)]
    public string? ReferenceEntityType { get; set; }

    [StringLength(50)]
    public string? ReferenceEntityId { get; set; }

    public int? DocumentId { get; set; }

    [InverseProperty("ParentFolder")]
    public virtual ICollection<DmsDocumentFolder> InverseParentFolder { get; set; } = new List<DmsDocumentFolder>();

    [ForeignKey("ParentFolderId")]
    [InverseProperty("InverseParentFolder")]
    public virtual DmsDocumentFolder? ParentFolder { get; set; }
}
