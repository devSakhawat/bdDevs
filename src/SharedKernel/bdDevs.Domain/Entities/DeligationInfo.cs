using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Domain.Entities;

[Table("DeligationInfo")]
public partial class DeligationInfo
{
    [Key]
    public int DeligationId { get; set; }

    public int? HrRecordId { get; set; }

    public int? DeligatedHrRecordId { get; set; }

    public DateOnly? FromDate { get; set; }

    public DateOnly? ToDate { get; set; }

    public int? IsActive { get; set; }
}
