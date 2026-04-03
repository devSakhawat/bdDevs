using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmMonth")]
public partial class CrmMonth
{
    [Key]
    public int MonthId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string MonthName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? MonthCode { get; set; }

    public bool? Status { get; set; }
}
