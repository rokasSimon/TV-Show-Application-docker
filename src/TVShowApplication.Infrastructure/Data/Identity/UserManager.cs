using System.Security.Claims;
using Microsoft.Extensions.Options;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.Core.Models.DTO.User;
using TVShowApplication.Core.Models.Entity;
using TVShowApplication.Core.Common.Exceptions;
using TVShowApplication.Core.Options;
using TVShowApplication.Core.Common.Extensions;

namespace TVShowApplication.Infrastructure.Data.Identity;

public class UserManager : IUserManager
{
    private const string BasicUserRoleSecret = "basic-user";
    private const string PosterRoleSecret = "poster-user";
    private const string AdminRoleSecret = "admin-user";

    private readonly IUserDataProvider _userDataProvider;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtGenerator _jwtGenerator;
    private readonly JwtOptions _jwtOptions;

    public UserManager(
        IUserDataProvider userDataProvider,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtGenerator jwtGenerator,
        IOptions<JwtOptions> jwtOptions)
    {
        _userDataProvider = userDataProvider;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtGenerator = jwtGenerator;
        _jwtOptions = jwtOptions.Value;
    }

    public async Task<bool> CreateUser(SignUpRequest request)
    {
        var user = await _userRepository.FindUserAsync(request.Email);

        if (user != null) throw new ArgumentException("User already taken");

        var salt = _passwordHasher.CreateSalt();
        var passwordHash = _passwordHasher.HashPassword(request.Password, salt);

        var newUser = request.RoleSecret switch
        {
            BasicUserRoleSecret => new User { Email = request.Email, HashedPassword = passwordHash, Salt = salt },
            PosterRoleSecret => new Poster { Email = request.Email, HashedPassword = passwordHash, Salt = salt, },
            AdminRoleSecret => new Administrator { Email = request.Email, HashedPassword = passwordHash, Salt = salt, },
            _ => new User { Email = request.Email, HashedPassword = passwordHash, Salt = salt },
        };
        if (newUser == null) throw new InvalidOperationException("Failed to construct user");

        var insertedUser = await _userRepository.InsertUserAsync(newUser);

        return insertedUser != null;
    }

    public async Task<AuthenticatedResponse?> GetTokenForUser(SignInRequest request)
    {
        var user = await _userRepository.FindUserAsync(request.Email);
        if (user == null) return null;

        var validPassword = _passwordHasher.VerifyPassword(user.HashedPassword, request.Password, user.Salt);
        if (!validPassword) return null;

        var accessToken = _jwtGenerator.GenerateToken(DefaultClaims(user, _jwtOptions.RefreshTokenExpirationDays!.Value));
        var refreshToken = _jwtGenerator.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(_jwtOptions.RefreshTokenExpirationDays!.Value);

        await _userRepository.UpdateUserAsync(user.Id, user);

        return new AuthenticatedResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }

    private static Dictionary<string, string> DefaultClaims(User user, int expirationDays)
    {
        var unixTimeOffset = DateTimeOffset.Now.AddDays(expirationDays).ToUnixTimeSeconds();

        var claims = new Dictionary<string, string>
        {
            { ClaimTypes.Role, user.GetRole().ToString() },
            { ClaimTypes.NameIdentifier, user.Id.ToString() },
            { "RefreshTokenExpirationTime", unixTimeOffset.ToString() },
        };

        return claims;
    }

    public async Task<AuthenticatedResponse?> RefreshToken(RefreshTokenRequest request)
    {
        var principal = _jwtGenerator.GetPrincipalFromExpiredToken(request.AccessToken);
        var idClaim = principal.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        var id = int.Parse(idClaim.Value);

        var user = await _userRepository.GetUserAsync<User>(id);

        if (user == null
            || user.RefreshToken != request.RefreshToken
            || user.RefreshTokenExpiryTime < DateTime.Now)
        {
            return null;
        }

        var newAccessToken = _jwtGenerator.GenerateToken(DefaultClaims(user, _jwtOptions.RefreshTokenExpirationDays!.Value));
        var newRefreshToken = _jwtGenerator.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;

        await _userRepository.UpdateUserAsync(id, user);

        return new AuthenticatedResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
        };
    }

    public async Task Revoke(int? userId = null)
    {
        if (userId == null)
        {
            var user = await _userRepository.GetUserAsync<User>(_userDataProvider.UserId) ?? throw new UnauthenticatedException("User is not logged in and cannot revoke token.");
            user.RefreshToken = null;
            await _userRepository.UpdateUserAsync(_userDataProvider.UserId, user);
        }
        else
        {
            var user = await _userRepository.GetUserAsync<User>(userId.Value);

            if (user == null) throw new ResourceNotFoundException("Unknown user id.");

            user.RefreshToken = null;
            await _userRepository.UpdateUserAsync(userId.Value, user);
        }
    }
}
