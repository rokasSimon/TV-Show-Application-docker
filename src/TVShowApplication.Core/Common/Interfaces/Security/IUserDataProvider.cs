using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Interfaces.Security;

public interface IUserDataProvider
{
    public Role UserRole { get; set; }
    public int UserId { get; set; }
}
