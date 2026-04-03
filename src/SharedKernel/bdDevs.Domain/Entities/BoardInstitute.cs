using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("BoardInstitute")]
public partial class BoardInstitute
{
    [Key]
    public int BoardInstituteId { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? BoardInstituteName { get; set; }

    public int? IsActive { get; set; }
}
