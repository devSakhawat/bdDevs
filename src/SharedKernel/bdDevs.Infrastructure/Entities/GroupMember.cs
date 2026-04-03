using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[PrimaryKey("GroupId", "UserId")]
[Table("GroupMember")]
public partial class GroupMember
{
    [Key]
    public int GroupId { get; set; }

    [Key]
    public int UserId { get; set; }

    [StringLength(50)]
    public string? GroupOption { get; set; }
}
