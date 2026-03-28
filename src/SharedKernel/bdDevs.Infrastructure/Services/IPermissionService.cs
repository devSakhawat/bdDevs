using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Infrastructure.Services;

public interface IPermissionService
{
	Task<IReadOnlyList<string>> GetPermissionsAsync(long userProfileId);
	Task InvalidateCacheAsync(long userProfileId);
}
