using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("AccessRestriction")]
public partial class AccessRestriction
{
    [Key]
    public int AccessRestrictionId { get; set; }

    public int HrRecordId { get; set; }

    public int ReferenceId { get; set; }

    public int ReferenceType { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AccessDate { get; set; }

    public int? AccessBy { get; set; }

    public int? ParentReference { get; set; }

    public int? ChiledParentReference { get; set; }

    public int? RestrictionType { get; set; }

    public int? GroupId { get; set; }
}
