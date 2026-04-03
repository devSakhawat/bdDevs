using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("Branch")]
public partial class Branch
{
    [Key]
    [Column("BRANCHID")]
    public int Branchid { get; set; }

    [Column("BRANCHNAME")]
    [StringLength(100)]
    public string Branchname { get; set; } = null!;

    [Column("BRANCHCODE")]
    [StringLength(50)]
    public string? Branchcode { get; set; }

    [Column("BRANCHDESCRIPTION")]
    [StringLength(2000)]
    public string? Branchdescription { get; set; }

    public int? IsCostCentre { get; set; }

    public int? IsActive { get; set; }

    public int? DebitAccountHead { get; set; }

    public int? CreditAccountHead { get; set; }

    public int? ContraEntryApplicable { get; set; }

    [StringLength(250)]
    [Unicode(false)]
    public string? BranchAddress { get; set; }

    public int? CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }
}
