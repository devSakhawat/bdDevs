using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("CompanyDepartmentMap")]
public partial class CompanyDepartmentMap
{
    public int SbuDepartmentMapId { get; set; }

    public int CompanyId { get; set; }

    public int DepartmentId { get; set; }
}
