using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

public partial class Competency
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string? CompetencyName { get; set; }

    public int? CompetencyType { get; set; }

    public int? IsDepartmentHead { get; set; }

    public int? IsActive { get; set; }
}
