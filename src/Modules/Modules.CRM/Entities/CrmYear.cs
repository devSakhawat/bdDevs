using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmYear")]
public partial class CrmYear
{
    [Key]
    public int YearId { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string YearName { get; set; } = null!;

    [StringLength(10)]
    [Unicode(false)]
    public string? YearCode { get; set; }

    public bool? Status { get; set; }
}
