using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Index("Module", "Resource", "Action", Name = "UQ__Permissi__F150BE9A72565D37", IsUnique = true)]
public partial class Permission
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string Module { get; set; } = null!;

    [StringLength(100)]
    public string Resource { get; set; } = null!;

    [StringLength(50)]
    public string Action { get; set; } = null!;

    [StringLength(200)]
    public string? DisplayName { get; set; }

    [InverseProperty("Permission")]
    public virtual ICollection<Menu> Menus { get; set; } = new List<Menu>();

    [InverseProperty("Permission")]
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
