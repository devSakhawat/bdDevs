using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("TIMESHEET")]
public partial class Timesheet
{
    [Key]
    [Column("TIMESHEETID")]
    public int Timesheetid { get; set; }

    [Column("HRRECORDID")]
    public int? Hrrecordid { get; set; }

    [Column("PROJECTID")]
    public int? Projectid { get; set; }

    [Column("TASKID")]
    public int? Taskid { get; set; }

    [Column("WORKING_LOG_DATE", TypeName = "datetime")]
    public DateTime? WorkingLogDate { get; set; }

    [Column("WORKED_LOG_HOUR")]
    public double? WorkedLogHour { get; set; }

    [Column("LOG_ENTRY_DATE", TypeName = "datetime")]
    public DateTime? LogEntryDate { get; set; }

    [Column("BILLABLE_LOG_HOUR")]
    public double? BillableLogHour { get; set; }

    [Column("NO_BILLABLE_LOG_HOUR")]
    public double? NoBillableLogHour { get; set; }

    [Column("ISAPPROVE")]
    public int? Isapprove { get; set; }

    [Column("APPROVE_RH_RRECORDID")]
    public int? ApproveRhRrecordid { get; set; }

    [Column("APPROVE_DATE", TypeName = "datetime")]
    public DateTime? ApproveDate { get; set; }

    [Column("BILL_STATUS")]
    public int? BillStatus { get; set; }
}
