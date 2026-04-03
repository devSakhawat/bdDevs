using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("CurencyRate")]
public partial class CurencyRate
{
    [Key]
    public int CurencyRateId { get; set; }

    public int CurrencyId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? CurrencyRateRation { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CurrencyMonth { get; set; }

    public int? CreateBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreateDate { get; set; }
}
