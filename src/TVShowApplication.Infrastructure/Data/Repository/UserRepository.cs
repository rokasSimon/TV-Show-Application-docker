using Microsoft.EntityFrameworkCore;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Repository;

public class UserRepository : IUserRepository
{
    private readonly TVShowContext _context;

    public UserRepository(TVShowContext context)
    {
        _context = context;
    }

    public async Task<T?> GetUserAsync<T>(int id) where T : User
    {
        var set = _context.Set<T>();

        var user = await set
            .Include(u => u.Reviews)
                .ThenInclude(r => r.ReviewedSeries.Genres)
            .SingleOrDefaultAsync(x => x.Id == id);

        return user;
    }

    public async Task<IEnumerable<T>> GetUsersAsync<T>() where T : User
    {
        var set = _context.Set<T>();

        var users = await set.ToListAsync();

        return users;
    }

    public async Task<T?> InsertUserAsync<T>(T user) where T : User
    {
        var set = _context.Set<T>();

        var createdUser = await set.AddAsync(user);
        var _ = await SaveAsync();

        if (createdUser == null)
        {
            return null;
        }

        return createdUser.Entity;
    }

    public async Task<bool> UpdateUserAsync<T>(int id, T user) where T : User
    {
        var set = _context.Set<T>();

        user.Id = id;
        set.Update(user);

        return await SaveAsync();
    }

    public async Task<bool> DeleteUserAsync<T>(int id) where T : User
    {
        var userToBeDeleted = new User { Id = id };

        _context.Users.Remove(userToBeDeleted);

        return await SaveAsync();
    }

    private async Task<bool> SaveAsync()
    {
        return await _context.SaveChangesAsync() != 0;
    }

    public async Task<User?> FindUserAsync(string email)
    {
        return await _context.Users.SingleOrDefaultAsync(x => x.Email == email);
    }
}
