using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("CompanyLocationMap")]
public partial class CompanyLocationMap
{
    public int SbuLocationMapId { get; set; }

    public int CompanyId { get; set; }

    public int BranchId { get; set; }
}
