using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

public partial class RefreshToken
{
    [Key]
    public int RefreshTokenId { get; set; }

    public int UserId { get; set; }

    [StringLength(500)]
    public string Token { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime? RevokedDate { get; set; }

    [StringLength(100)]
    public string? CreatedByIp { get; set; }

    [StringLength(500)]
    public string? ReplacedByToken { get; set; }
}
