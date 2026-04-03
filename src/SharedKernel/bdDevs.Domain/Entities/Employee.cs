using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("Employee")]
public partial class Employee
{
    [Key]
    [Column("HRRecordId")]
    public int HrrecordId { get; set; }

    [StringLength(500)]
    public string? FullName { get; set; }

    [StringLength(500)]
    public string? FatherName { get; set; }

    [StringLength(500)]
    public string? MotherName { get; set; }

    [StringLength(500)]
    public string? SpouseName { get; set; }

    public int Gender { get; set; }

    public int? ReligionId { get; set; }

    public int? Nationality { get; set; }

    [Column("NationalID")]
    [StringLength(250)]
    public string? NationalId { get; set; }

    [StringLength(250)]
    public string? PassportNo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateofBirth { get; set; }

    public int? PlaceofBirth { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateofMarriage { get; set; }

    public string? PresentAddress { get; set; }

    public int? Thana { get; set; }

    public int? District { get; set; }

    public string? PermanentAddress { get; set; }

    public int? PermanentAddressThana { get; set; }

    public int? PermanentAddressDistrict { get; set; }

    [StringLength(50)]
    public string? HomePhone { get; set; }

    [StringLength(500)]
    public string? MobileNo { get; set; }

    [StringLength(250)]
    public string? PersonalEmail { get; set; }

    public string? InternetMessenger { get; set; }

    public string? InternetProfileLink { get; set; }

    [StringLength(50)]
    public string? AdditionalInfo { get; set; }

    public int? AdditionalDayOf { get; set; }

    public int? DayOfType { get; set; }

    public int? AppliedDayOfWeek { get; set; }

    public int? NumberofDays { get; set; }

    public int? CasualLeaveNo { get; set; }

    public int? MedicalLeaveNo { get; set; }

    public int? AnualLeaveNo { get; set; }

    public int? ShortLeaveNo { get; set; }

    [StringLength(50)]
    public string? BloodGroup { get; set; }

    public int? StateId { get; set; }

    [StringLength(50)]
    public string? OriginalBirthDay { get; set; }

    public int? UserId { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? LastUpdatedDate { get; set; }

    public int? ApproverId { get; set; }

    [Column(TypeName = "smalldatetime")]
    public DateTime? ApproveDate { get; set; }

    public bool? LogHourEnable { get; set; }

    [Column("PROFILEPICTURE")]
    [StringLength(2000)]
    public string? Profilepicture { get; set; }

    [Column("MERITIALSTATUS")]
    public int? Meritialstatus { get; set; }

    [Column("BIRTHIDENTIFICATION")]
    [StringLength(100)]
    public string? Birthidentification { get; set; }

    [Column("PLACEOFPASSPORTISSUE")]
    public int? Placeofpassportissue { get; set; }

    [Column("PASSPORTISSUEDATE", TypeName = "datetime")]
    public DateTime? Passportissuedate { get; set; }

    [Column("PASSPORTEXPIREDATE", TypeName = "datetime")]
    public DateTime? Passportexpiredate { get; set; }

    [Column("HEIGHT")]
    [StringLength(50)]
    public string? Height { get; set; }

    [Column("WEIGHT")]
    [StringLength(50)]
    public string? Weight { get; set; }

    [Column("HOBBY")]
    [StringLength(2000)]
    public string? Hobby { get; set; }

    [Column("SIGNATURE")]
    [StringLength(2000)]
    public string? Signature { get; set; }

    [Column("IDENTIFICATIONMARK")]
    [StringLength(1000)]
    public string? Identificationmark { get; set; }

    [Column("TAXEXAMPTION")]
    public int? Taxexamption { get; set; }

    [Column("INVESTMENTAMOUNT")]
    public int? Investmentamount { get; set; }

    [StringLength(50)]
    public string? ShortName { get; set; }

    public int? IsAutistic { get; set; }

    [StringLength(50)]
    public string? PresentPostCode { get; set; }

    [StringLength(50)]
    public string? PermanentPostCode { get; set; }

    [Column("REFEMPID")]
    [StringLength(50)]
    public string? Refempid { get; set; }

    public int? EmployeeLevel { get; set; }
}
