using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("DOCMDETAILS")]
public partial class Docmdetail
{
    [Key]
    [Column("DOCUMENT_ID")]
    public int DocumentId { get; set; }

    [Column("UPLOADED_BY")]
    public int UploadedBy { get; set; }

    [Column("DEPARTMENT_ID")]
    public int DepartmentId { get; set; }

    [Column("RESPONSIBLEPERSONTO")]
    public int Responsiblepersonto { get; set; }

    [Column("SUBJECT")]
    [StringLength(500)]
    public string? Subject { get; set; }

    [Column("FILENAME")]
    [StringLength(500)]
    public string? Filename { get; set; }

    [Column("FILEDESCRIPTION")]
    [StringLength(500)]
    public string? Filedescription { get; set; }

    [Column("FULLPATH")]
    [StringLength(1000)]
    public string? Fullpath { get; set; }

    [Column("STATUS_ID")]
    public int? StatusId { get; set; }

    [Column("UPLOADED_DATE", TypeName = "datetime")]
    public DateTime? UploadedDate { get; set; }

    [Column("LASTOPENORCLOSEBYID")]
    public int? Lastopenorclosebyid { get; set; }

    [Column("LASTUPDATE", TypeName = "datetime")]
    public DateTime? Lastupdate { get; set; }

    [Column("REMARKS")]
    [StringLength(1000)]
    public string? Remarks { get; set; }
}
