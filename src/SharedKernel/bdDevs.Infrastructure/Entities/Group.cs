using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

public partial class Group
{
    [Key]
    public int GroupId { get; set; }

    [StringLength(100)]
    public string? GroupName { get; set; }

    public int? IsDefault { get; set; }
}
