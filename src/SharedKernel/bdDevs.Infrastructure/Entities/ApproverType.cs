using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("ApproverType")]
public partial class ApproverType
{
    [Key]
    public int ApproverTypeId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ApproverTypeName { get; set; }
}
