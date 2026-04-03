using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentTag")]
[Index("DocumentTagName", Name = "UQ__DMSDocum__737584F60E3D41BA", IsUnique = true)]
public partial class DmsDocumentTag
{
    [Key]
    public int TagId { get; set; }

    [StringLength(200)]
    public string DocumentTagName { get; set; } = null!;

    [InverseProperty("Tag")]
    public virtual ICollection<DmsDocumentTagMap> DmsDocumentTagMaps { get; set; } = new List<DmsDocumentTagMap>();
}
