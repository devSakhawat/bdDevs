using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[PrimaryKey("UserProfileId", "RoleId")]
public partial class UserRole
{
    [Key]
    public long UserProfileId { get; set; }

    [Key]
    public int RoleId { get; set; }

    public DateTime AssignedAt { get; set; }

    public long? AssignedBy { get; set; }

    [ForeignKey("RoleId")]
    [InverseProperty("UserRoles")]
    public virtual Role Role { get; set; } = null!;

    [ForeignKey("UserProfileId")]
    [InverseProperty("UserRoles")]
    public virtual UserProfile UserProfile { get; set; } = null!;
}
