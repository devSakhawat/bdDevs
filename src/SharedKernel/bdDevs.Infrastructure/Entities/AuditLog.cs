using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("AuditLog")]
public partial class AuditLog
{
    public int AuditId { get; set; }

    public int HrRecordId { get; set; }

    [StringLength(500)]
    public string? ClientUser { get; set; }

    [Column("ClientIP")]
    [StringLength(50)]
    public string? ClientIp { get; set; }

    [StringLength(500)]
    public string? MacAddress { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? BrowserInfo { get; set; }

    public int? AuditTypeId { get; set; }

    public string? AuditDetails { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AuditDate { get; set; }

    [Unicode(false)]
    public string? RequestedUrl { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? ReferrerUrl { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? DomainName { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string? ActionName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ControllerName { get; set; }

    [Unicode(false)]
    public string? RequestedParams { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TableName { get; set; }

    public int? IdentityInTable { get; set; }

    public int? MenuId { get; set; }

    public int? ModuleId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AuditStatus { get; set; }

    [Unicode(false)]
    public string? ExceptionLog { get; set; }
}
