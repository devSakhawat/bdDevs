using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Holiday")]
public partial class Holiday
{
    [Key]
    [Column("HolidayID")]
    public int HolidayId { get; set; }

    public int? HolidayType { get; set; }

    public DateOnly? HolidayDate { get; set; }

    [Column("SHIFTID")]
    public int? Shiftid { get; set; }

    public int? Month { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MonthName { get; set; }

    public int? YearName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdatedDate { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? DayName { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public int? RosterReschedule { get; set; }
}
