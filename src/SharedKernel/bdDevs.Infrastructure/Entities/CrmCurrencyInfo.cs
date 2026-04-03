using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmCurrencyInfo")]
public partial class CrmCurrencyInfo
{
    [Key]
    public int CurrencyId { get; set; }

    [StringLength(50)]
    public string? CurrencyName { get; set; }

    public int? IsDefault { get; set; }

    public int? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }
}
