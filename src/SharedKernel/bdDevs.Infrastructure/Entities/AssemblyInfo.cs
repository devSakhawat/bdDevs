using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("AssemblyInfo")]
public partial class AssemblyInfo
{
    [Key]
    public int AssemblyInfoId { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string AssemblyTitle { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string AssemblyDescription { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string AssemblyCompany { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string AssemblyProduct { get; set; } = null!;

    [StringLength(150)]
    [Unicode(false)]
    public string AssemblyCopyright { get; set; } = null!;

    [StringLength(50)]
    [Unicode(false)]
    public string AssemblyVersion { get; set; } = null!;

    [StringLength(250)]
    [Unicode(false)]
    public string ProductBanner { get; set; } = null!;

    /// <summary>
    /// false=Attedance by login inactive feature
    /// </summary>
    public bool IsAttendanceByLogin { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string PoweredBy { get; set; } = null!;

    [StringLength(250)]
    [Unicode(false)]
    public string PoweredByUrl { get; set; } = null!;

    public bool IsDefault { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? ProductStyleSheet { get; set; }

    public string? ApiPath { get; set; }

    [StringLength(250)]
    public string? CvBankPath { get; set; }
}
