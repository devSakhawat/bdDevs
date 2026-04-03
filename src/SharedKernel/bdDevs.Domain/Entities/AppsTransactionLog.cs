using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Keyless]
[Table("AppsTransactionLog")]
public partial class AppsTransactionLog
{
    public int TransactionLogId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime TransactionDate { get; set; }

    [StringLength(100)]
    public string TransactionType { get; set; } = null!;

    public int? ResponseCode { get; set; }

    [StringLength(200)]
    public string? Request { get; set; }

    [StringLength(2000)]
    public string? Response { get; set; }

    [StringLength(1000)]
    public string? Remarks { get; set; }

    [StringLength(50)]
    public string? AppsUserId { get; set; }

    [StringLength(100)]
    public string? EmployeeId { get; set; }
}
