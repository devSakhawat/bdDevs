using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentTagMap")]
public partial class DmsDocumentTagMap
{
    public int DocumentId { get; set; }

    public int TagId { get; set; }

    [Key]
    public int TagMapId { get; set; }

    [ForeignKey("DocumentId")]
    [InverseProperty("DmsDocumentTagMaps")]
    public virtual DmsDocument Document { get; set; } = null!;

    [ForeignKey("TagId")]
    [InverseProperty("DmsDocumentTagMaps")]
    public virtual DmsDocumentTag Tag { get; set; } = null!;
}
