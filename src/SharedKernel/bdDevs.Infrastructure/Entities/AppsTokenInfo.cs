using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("AppsTokenInfo")]
public partial class AppsTokenInfo
{
    [Key]
    public int AppsTokenInfoId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? AppsUserId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EmployeeId { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? TokenNumber { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? IssueDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ExpiredDate { get; set; }
}
