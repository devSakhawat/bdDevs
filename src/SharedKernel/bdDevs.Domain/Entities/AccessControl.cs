using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("AccessControl")]
public partial class AccessControl
{
    [Key]
    public int AccessId { get; set; }

    [StringLength(50)]
    public string AccessName { get; set; } = null!;
}
