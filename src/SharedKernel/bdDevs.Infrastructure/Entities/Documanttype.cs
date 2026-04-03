using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DOCUMANTTYPE")]
public partial class Documanttype
{
    [Key]
    [Column("DOCUMENTTYPEID")]
    public int Documenttypeid { get; set; }

    [Column("DOCUMENTNAME")]
    [StringLength(100)]
    public string? Documentname { get; set; }

    [Column("INITIATIONDATE", TypeName = "datetime")]
    public DateTime? Initiationdate { get; set; }

    [Column("DESCRIPTION", TypeName = "text")]
    public string? Description { get; set; }

    /// <summary>
    /// 1=Personal Document,2=Applicant Document
    /// </summary>
    public int? UseType { get; set; }
}
