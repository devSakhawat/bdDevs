using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

[Table("CrmInstituteType")]
public partial class CrmInstituteType
{
    [Key]
    public int InstituteTypeId { get; set; }

    [StringLength(150)]
    [Unicode(false)]
    public string InstituteTypeName { get; set; } = null!;
}
