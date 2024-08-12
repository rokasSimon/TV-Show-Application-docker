using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.API.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeRolesAttribute : Attribute, IAuthorizationFilter
{
    private readonly IList<Role> _roles;

    public AuthorizeRolesAttribute(params Role[] roles)
    {
        _roles = roles ?? [];
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // skip authorization if action is decorated with [AllowAnonymous] attribute
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous)
            return;

        foreach (var role in _roles)
        {
            if (context.HttpContext.User.IsInRole(role.ToString())) return;
        }

        context.Result = new UnauthorizedResult();
    }
}