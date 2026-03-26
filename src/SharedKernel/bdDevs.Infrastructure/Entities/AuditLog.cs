using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Index("TableName", "RecordId", Name = "IX_AuditLogs_TableName")]
public partial class AuditLog
{
    [Key]
    public long Id { get; set; }

    [StringLength(200)]
    public string TableName { get; set; } = null!;

    [StringLength(100)]
    public string RecordId { get; set; } = null!;

    public byte Action { get; set; }

    public string? OldDataJson { get; set; }

    public string? NewDataJson { get; set; }

    public long? ChangedBy { get; set; }

    public DateTime ChangedAt { get; set; }

    [StringLength(45)]
    public string? IpAddress { get; set; }
}
