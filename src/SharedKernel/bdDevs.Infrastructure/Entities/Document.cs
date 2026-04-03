using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Table("DOCUMENT")]
public partial class Document
{
    [Key]
    [Column("DOCUMENTID")]
    public int Documentid { get; set; }

    [Column("HRRECORDID")]
    public int? Hrrecordid { get; set; }

    [Column("DOCUMENTTYPEID")]
    public int? Documenttypeid { get; set; }

    [Column("TITLEOFDOCUMENT")]
    [StringLength(200)]
    public string? Titleofdocument { get; set; }

    [Column("ATTACHEDDOCUMENT")]
    [StringLength(200)]
    public string? Attacheddocument { get; set; }

    [Column("SUMMARY")]
    [StringLength(2000)]
    public string? Summary { get; set; }
}
