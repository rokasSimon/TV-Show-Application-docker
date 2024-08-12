using System.Security.Claims;

namespace TVShowApplication.Core.Common.Interfaces.Security;

public interface IJwtGenerator
{
    string GenerateToken(IDictionary<string, string> claims);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
