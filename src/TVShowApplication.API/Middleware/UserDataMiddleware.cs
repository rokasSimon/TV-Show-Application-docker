using System.Security.Claims;
using TVShowApplication.Core.Common.Exceptions;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Middleware;

public class UserDataMiddleware
{
    private readonly RequestDelegate _next;

    public UserDataMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IUserDataProvider userDataProvider)
    {
        if (context.User.Identity is not null &&
            context.User.Identity.IsAuthenticated)
        {
            var roleClaim = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);
            var idClaim = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

            if (roleClaim == null || idClaim == null) throw new UnauthorizedException("Missing role or id claim.");

            userDataProvider.UserRole = Enum.Parse<Role>(roleClaim.Value);
            userDataProvider.UserId = int.Parse(idClaim.Value);
        }

        await _next(context);
    }
}
