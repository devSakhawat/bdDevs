using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Currency")]
public partial class Currency
{
    [Key]
    public int CurrencyId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string CurrencyName { get; set; } = null!;

    [StringLength(5)]
    [Unicode(false)]
    public string CurrencyCode { get; set; } = null!;
}
