using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("EMPLOYEETYPE")]
public partial class Employeetype
{
    [Key]
    [Column("EMPLOYEETYPEID")]
    public int Employeetypeid { get; set; }

    [Column("EMPLOYEETYPENAME")]
    [StringLength(50)]
    public string Employeetypename { get; set; } = null!;

    [StringLength(50)]
    public string? EmployeeTypeCode { get; set; }

    public int? IsActive { get; set; }

    public bool? IsContract { get; set; }

    public bool? IsNotAccess { get; set; }

    public int? IsPfApplicable { get; set; }

    public int? IsTrainee { get; set; }

    public int? IsRegular { get; set; }

    public int? IsUnion { get; set; }

    public int? IsProbationary { get; set; }

    public int? IsUnionProbationary { get; set; }

    public int? EmpTypeSortOrder { get; set; }

    public int? IsEwfApplicable { get; set; }
}
