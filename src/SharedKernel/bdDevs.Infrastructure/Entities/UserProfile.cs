using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Index("AspNetUserId", Name = "IX_UserProfiles_AspNetUserId")]
[Index("AspNetUserId", Name = "UQ__UserProf__F42021A6B405F4C6", IsUnique = true)]
public partial class UserProfile
{
    [Key]
    public long Id { get; set; }

    public string AspNetUserId { get; set; } = null!;

    public long? BranchId { get; set; }

    [StringLength(50)]
    public string? EmployeeCode { get; set; }

    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [StringLength(100)]
    public string? Designation { get; set; }

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    [StringLength(500)]
    public string? ProfileImageUrl { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public DateOnly? JoiningDate { get; set; }

    public byte EmploymentType { get; set; }

    public byte Status { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public string? SettingsJson { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public long? ModifiedBy { get; set; }

    [InverseProperty("UserProfile")]
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
