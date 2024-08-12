using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Identity;

public class UserDataProvider : IUserDataProvider
{
    public Role UserRole { get; set; }
    public int UserId { get; set; }
}
