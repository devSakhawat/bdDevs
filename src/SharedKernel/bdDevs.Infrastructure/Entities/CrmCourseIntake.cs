using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("CrmCourseIntake")]
public partial class CrmCourseIntake
{
    [Key]
    public int CourseIntakeId { get; set; }

    public int CourseId { get; set; }

    public int? MonthId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? IntakeTitile { get; set; }
}
