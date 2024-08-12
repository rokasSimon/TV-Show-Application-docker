using TVShowApplication.Core.Common.Interfaces.Security;
using BC = BCrypt.Net.BCrypt;

namespace TVShowApplication.Core.Security.Services;

public class BcryptHasher : IPasswordHasher
{
    public string CreateSalt()
    {
        return BC.GenerateSalt();
    }

    public string HashPassword(string password, string salt)
    {
        return BC.HashPassword(password, salt);
    }

    public bool VerifyPassword(string hashedPassword, string password, string salt)
    {
        return BC.Verify(password, hashedPassword);
    }
}
