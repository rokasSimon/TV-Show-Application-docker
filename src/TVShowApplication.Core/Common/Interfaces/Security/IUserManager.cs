using TVShowApplication.Core.Models.DTO.User;

namespace TVShowApplication.Core.Common.Interfaces.Security;

public interface IUserManager
{
    Task<bool> CreateUser(SignUpRequest request);
    Task<AuthenticatedResponse?> GetTokenForUser(SignInRequest request);
    Task<AuthenticatedResponse?> RefreshToken(RefreshTokenRequest request);
    Task Revoke(int? userId = null);
}
