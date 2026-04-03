using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Employment")]
public partial class Employment
{
    [Key]
    [Column("HRRecordId")]
    public int HrrecordId { get; set; }

    [StringLength(50)]
    public string? EmployeeId { get; set; }

    public int? EmployeeType { get; set; }

    [Column("DESIGNATIONID")]
    public int? Designationid { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? StartDate { get; set; }

    public DateOnly? EmploymentDate { get; set; }

    public int? CompanyId { get; set; }

    public int? DepartmentId { get; set; }

    public int? ReportTo { get; set; }

    [StringLength(50)]
    public string? TelephoneExtension { get; set; }

    [StringLength(250)]
    public string? OfficialEmail { get; set; }

    [StringLength(250)]
    public string? EmergencyContactName { get; set; }

    [StringLength(250)]
    public string? EmergencyContactNo { get; set; }

    public string? Duties { get; set; }

    [StringLength(50)]
    public string? AttendanceCardNo { get; set; }

    public int? UserId { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? LastUpdatedDate { get; set; }

    public int? BankBranchId { get; set; }

    [StringLength(50)]
    public string? BankAccountNo { get; set; }

    [Column("BRANCHID")]
    public int? Branchid { get; set; }

    [Column("SHIFTID")]
    public int? Shiftid { get; set; }

    [Column("GPFNO")]
    [StringLength(100)]
    public string? Gpfno { get; set; }

    public DateOnly? JobEndDate { get; set; }

    [Column("JOININGPOST")]
    public int? Joiningpost { get; set; }

    [Column("EXPERIENCE")]
    [StringLength(2000)]
    public string? Experience { get; set; }

    [Column("REPORTDEPID")]
    public int? Reportdepid { get; set; }

    [Column("Func_Id")]
    public int? FuncId { get; set; }

    public DateOnly? ContractEndDate { get; set; }

    public int? JobEndTypeId { get; set; }

    public int? GradeId { get; set; }

    [StringLength(50)]
    public string? TinNumber { get; set; }

    public int? PostingType { get; set; }

    [Column("IsOTEligible")]
    public int? IsOteligible { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? ContactAddress { get; set; }

    public int? IsFieldForce { get; set; }

    public int? ApproverDepartmentId { get; set; }

    public int? Approver { get; set; }

    public int? DivisionId { get; set; }

    public int? FacilityId { get; set; }

    public int? SectionId { get; set; }

    public int? IsReserved { get; set; }

    public DateOnly? ConfirmationDate { get; set; }

    public DateOnly? AppointmentDate { get; set; }

    public int? SalaryLocation { get; set; }

    public int? OmitLate { get; set; }

    public DateOnly? PossibleConfirmationDate { get; set; }

    public string? JobResponsibilities { get; set; }

    public string? FunctionalJob { get; set; }

    public int? ApplicantId { get; set; }

    [StringLength(250)]
    public string? SeparationRemarks { get; set; }

    public DateOnly? ResignationSummiteDate { get; set; }

    public int? IsProbExtnAllow { get; set; }

    public int? Jobid { get; set; }

    public int? VerificationStatus { get; set; }
}
