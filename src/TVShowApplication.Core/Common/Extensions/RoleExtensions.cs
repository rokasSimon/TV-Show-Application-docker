using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Extensions;

public static class RoleExtensions
{
    public static Role GetRole(this User user)
    {
        if (user == null) return Role.Unauthorized;

        return user switch
        {
            Administrator => Role.Admin,
            Poster => Role.Poster,
            User => Role.User,
            _ => Role.Unauthorized,
        };
    }

    public static Role GetRole<TUser>() where TUser : User, new()
    {
        var user = new TUser();

        return user.GetRole();
    }

    public static Role[] GetRoles(this User user)
    {
        if (user == null) return [];

        return user switch
        {
            Administrator => [Role.Admin, Role.Poster, Role.User],
            Poster => [Role.Poster, Role.User],
            User => [Role.User],
            _ => [],
        };
    }

    public static bool IsInRoles(this Role role, params Role[] requiredRoles)
    {
        foreach (var r in requiredRoles)
        {
            if (role == r) return true;
        }

        return false;
    }
}
