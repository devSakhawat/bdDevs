using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Index("Token", Name = "IX_RefreshTokens_Token")]
[Index("UserId", Name = "IX_RefreshTokens_UserId")]
[Index("Token", Name = "UQ__RefreshT__1EB4F817396D033D", IsUnique = true)]
public partial class RefreshToken
{
    [Key]
    public long Id { get; set; }

    public string UserId { get; set; } = null!;

    [StringLength(500)]
    public string Token { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    [StringLength(500)]
    public string? ReplacedBy { get; set; }

    [StringLength(50)]
    public string? CreatedByIp { get; set; }
}
