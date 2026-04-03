using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("AUDIT_TRAIL")]
public partial class AuditTrail
{
    [Column("AUDIT_ID")]
    public int AuditId { get; set; }

    [Column("USER_ID")]
    public int UserId { get; set; }

    [Column("CLIENT_USER")]
    [StringLength(500)]
    public string? ClientUser { get; set; }

    [Column("CLIENT_IP")]
    [StringLength(50)]
    public string? ClientIp { get; set; }

    [Column("SHORTDESCRIPTION")]
    public string? Shortdescription { get; set; }

    [Column("AUDIT_TYPE")]
    [StringLength(500)]
    public string? AuditType { get; set; }

    [Column("AUDIT_DESCRIPTION")]
    public string? AuditDescription { get; set; }

    [Column("ACTION_DATE", TypeName = "datetime")]
    public DateTime? ActionDate { get; set; }

    [Column("Requested_Url")]
    public string? RequestedUrl { get; set; }

    [Column("Audit_Status")]
    [StringLength(50)]
    public string? AuditStatus { get; set; }
}
