using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Keyless]
[Table("AboutUsLicense")]
public partial class AboutUsLicense
{
    public int? AssemblyId { get; set; }

    [Column("AboutUsLicenseID")]
    public int AboutUsLicenseId { get; set; }

    [StringLength(50)]
    public string? LicenseFor { get; set; }

    [StringLength(50)]
    public string? ProductCode { get; set; }

    [StringLength(50)]
    public string? CodeBaseVersion { get; set; }

    [StringLength(50)]
    public string? LicenseNumber { get; set; }

    [StringLength(50)]
    public string? LicenseType { get; set; }

    [Column("SBULicense")]
    [StringLength(50)]
    public string? Sbulicense { get; set; }

    [StringLength(50)]
    public string? LocationLicense { get; set; }

    [StringLength(50)]
    public string? UserLicense { get; set; }

    [Column("ServerID")]
    [StringLength(50)]
    public string? ServerId { get; set; }

    public int? IsActive { get; set; }
}
