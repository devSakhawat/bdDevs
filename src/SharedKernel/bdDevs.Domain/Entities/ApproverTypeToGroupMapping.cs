using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Keyless]
[Table("ApproverTypeToGroupMapping")]
public partial class ApproverTypeToGroupMapping
{
    public int ApproverTypeMapId { get; set; }

    public int? ApproverTypeId { get; set; }

    public int? ModuleId { get; set; }

    public int? GroupId { get; set; }

    [ForeignKey("ApproverTypeId")]
    public virtual ApproverType? ApproverType { get; set; }
}
