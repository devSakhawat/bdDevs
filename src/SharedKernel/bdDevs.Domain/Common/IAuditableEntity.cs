namespace bdDevs.Domain.Common;

public interface IAuditableEntity
{
	DateTime CreatedAt { get; set; }
	DateTime? ModifiedAt { get; set; }
}