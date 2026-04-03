using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("GroupPermission")]
public partial class GroupPermission
{
    [Key]
    public int PermissionId { get; set; }

    [Column("PERMISSIONTABLENAME")]
    [StringLength(50)]
    public string? Permissiontablename { get; set; }

    [Column("GROUPID")]
    public int Groupid { get; set; }

    [Column("REFERENCEID")]
    public int? Referenceid { get; set; }

    [Column("PARENTPERMISSION")]
    public int? Parentpermission { get; set; }
}
