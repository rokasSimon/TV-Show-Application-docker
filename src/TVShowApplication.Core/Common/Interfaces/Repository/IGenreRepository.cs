using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Interfaces.Repository;

public interface IGenreRepository
{
    Task<Genre?> GetGenreAsync(int id);
    Task<IEnumerable<Genre>> GetGenresAsync();
    Task<Genre?> InsertGenreAsync(Genre genre);
    Task<bool> UpdateGenreAsync(int id, Genre genre);
    Task<bool> DeleteGenreAsync(int id);
}
