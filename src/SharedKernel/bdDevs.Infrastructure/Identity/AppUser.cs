using bdDevs.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;

namespace bdDevs.Infrastructure.Identity;

public class AppUser : IdentityUser
{
	public virtual UserProfile? Profile { get; set; }
}
