using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DmsDocumentAccessLog")]
public partial class DmsDocumentAccessLog
{
    [Key]
    public long LogId { get; set; }

    public int DocumentId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AccessedByUserId { get; set; }

    public DateTime? AccessDateTime { get; set; }

    [StringLength(50)]
    public string Action { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string? IpAddress { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? DeviceInfo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MacAddress { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? Notes { get; set; }

    [ForeignKey("DocumentId")]
    [InverseProperty("DmsDocumentAccessLogs")]
    public virtual DmsDocument Document { get; set; } = null!;
}
