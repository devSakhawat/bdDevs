using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsFileUpdateHistory")]
public partial class DmsFileUpdateHistory
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    public string? EntityId { get; set; }

    [StringLength(255)]
    public string? EntityType { get; set; }

    [StringLength(255)]
    public string? DocumentType { get; set; }

    public string? OldFilePath { get; set; }

    public string? NewFilePath { get; set; }

    public int? VersionNumber { get; set; }

    [StringLength(255)]
    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    [StringLength(500)]
    public string? UpdateReason { get; set; }

    public string? Notes { get; set; }
}
