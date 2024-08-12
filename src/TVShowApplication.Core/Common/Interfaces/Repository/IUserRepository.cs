using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Interfaces.Repository;

public interface IUserRepository
{
    Task<T?> GetUserAsync<T>(int id) where T : User;
    Task<IEnumerable<T>> GetUsersAsync<T>() where T : User;
    Task<T?> InsertUserAsync<T>(T user) where T : User;
    Task<bool> UpdateUserAsync<T>(int id, T user) where T : User;
    Task<bool> DeleteUserAsync<T>(int id) where T : User;

    Task<User?> FindUserAsync(string email);
}
