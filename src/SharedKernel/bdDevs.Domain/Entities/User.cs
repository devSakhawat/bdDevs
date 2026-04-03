using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

public partial class User
{
    [Key]
    public int UserId { get; set; }

    [Column("CompanyID")]
    public int? CompanyId { get; set; }

    [StringLength(50)]
    public string? LoginId { get; set; }

    [StringLength(500)]
    public string? UserName { get; set; }

    [StringLength(100)]
    public string? Password { get; set; }

    /// <summary>
    /// EmployeeId As HrRecordId
    /// </summary>
    public int? EmployeeId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdatedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastLoginDate { get; set; }

    public int? FailedLoginNo { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsExpired { get; set; }

    [Column("THEME")]
    [StringLength(100)]
    public string? Theme { get; set; }

    public int? AccessParentCompany { get; set; }

    public int? DefaultDashboard { get; set; }

    public bool? IsSystemUser { get; set; }
}
