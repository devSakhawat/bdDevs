using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("ApproverHistory")]
public partial class ApproverHistory
{
    [Key]
    public int AssignApproverId { get; set; }

    public int ApproverId { get; set; }

    public int HrRecordId { get; set; }

    public int ModuleId { get; set; }

    public int Type { get; set; }

    public int IsNew { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsActive { get; set; }

    public int? IsParallel { get; set; }

    public int? DeleteBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DeleteDate { get; set; }

    public int? CreateBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }
}
