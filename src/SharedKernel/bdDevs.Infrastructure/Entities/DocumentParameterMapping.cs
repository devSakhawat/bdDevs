using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Entities;

[Keyless]
[Table("DocumentParameterMapping")]
public partial class DocumentParameterMapping
{
    public int MappingId { get; set; }

    public int? DocumentTypeId { get; set; }

    public int? ParameterId { get; set; }

    public bool? IsVisible { get; set; }

    [ForeignKey("DocumentTypeId")]
    public virtual Documanttype? DocumentType { get; set; }

    [ForeignKey("ParameterId")]
    public virtual DocumentParameter? Parameter { get; set; }
}
