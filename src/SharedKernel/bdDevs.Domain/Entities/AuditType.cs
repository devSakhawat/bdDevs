using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Keyless]
[Table("AuditType")]
public partial class AuditType
{
    public int? AuditTypeId { get; set; }

    [Column("AuditType")]
    [StringLength(250)]
    [Unicode(false)]
    public string? AuditType1 { get; set; }
}
