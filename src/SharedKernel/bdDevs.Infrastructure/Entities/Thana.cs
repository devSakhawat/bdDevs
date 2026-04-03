using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Thana")]
public partial class Thana
{
    [Key]
    public int ThanaId { get; set; }

    public int DistrictId { get; set; }

    [StringLength(100)]
    public string? ThanaName { get; set; }

    [StringLength(50)]
    public string? ThanaCode { get; set; }

    public int? Status { get; set; }

    [Column("ThanaName_bn")]
    [StringLength(100)]
    public string? ThanaNameBn { get; set; }
}
