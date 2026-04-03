using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("ApproverOrder")]
public partial class ApproverOrder
{
    [Key]
    public int ApproverOrderId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? OrderTitle { get; set; }

    public int? ModuleId { get; set; }

    public int? ApproverTypeId { get; set; }

    public bool? IsEditable { get; set; }
}
