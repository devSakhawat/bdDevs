using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("WfAction")]
public partial class WfAction
{
    [Key]
    [Column("WFActionId")]
    public int WfactionId { get; set; }

    [Column("WFStateId")]
    public int WfstateId { get; set; }

    [StringLength(50)]
    public string ActionName { get; set; } = null!;

    public int NextStateId { get; set; }

    [Column("EMAIL_ALERT")]
    public int? EmailAlert { get; set; }

    [Column("SMS_ALERT")]
    public int? SmsAlert { get; set; }

    public int? AcSortOrder { get; set; }
}
