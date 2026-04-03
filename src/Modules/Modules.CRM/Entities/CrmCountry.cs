using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmCountry")]
public partial class CrmCountry
{
    [Key]
    public int CountryId { get; set; }

    [StringLength(100)]
    public string? CountryName { get; set; }

    [StringLength(50)]
    public string? CountryCode { get; set; }

    public int? Status { get; set; }
}
