using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Modules.CRM.Entities;

/// <summary>
/// Stores payment methods available in CRM system
/// </summary>
[Table("CrmPaymentMethod")]
[Index("IsOnlinePayment", Name = "IX_CrmPaymentMethod_IsOnlinePayment")]
[Index("IsActive", Name = "IX_CrmPaymentMethod_Status")]
public partial class CrmPaymentMethod
{
    [Key]
    public int PaymentMethodId { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string PaymentMethodName { get; set; } = null!;

    [StringLength(20)]
    [Unicode(false)]
    public string? PaymentMethodCode { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Description { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ProcessingFee { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? ProcessingFeeType { get; set; }

    public bool IsOnlinePayment { get; set; }

    public bool? IsActive { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; }

    public int CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }
}
