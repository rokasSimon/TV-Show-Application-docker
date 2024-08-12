using TVShowApplication.Core.Common.Exceptions;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Extensions;

public static class Fault
{
    public static void IfMissingRole(Role role, params Role[] requiredRoles)
    {
        if (role.IsInRoles(requiredRoles)) return;

        throw new UnauthorizedException($"User with role {role} has missing roles.");
    }
}
