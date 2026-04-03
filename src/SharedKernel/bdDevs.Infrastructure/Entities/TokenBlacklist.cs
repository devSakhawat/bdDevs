using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("TokenBlacklist")]
public partial class TokenBlacklist
{
    public string Token { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime ExpiryDate { get; set; }

    public Guid TokenId { get; set; }
}
