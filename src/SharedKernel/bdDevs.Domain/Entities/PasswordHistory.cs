using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("PasswordHistory")]
public partial class PasswordHistory
{
    [Key]
    public int HistoryId { get; set; }

    public int? UserId { get; set; }

    [StringLength(50)]
    public string? OldPassword { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PasswordChangeDate { get; set; }
}
