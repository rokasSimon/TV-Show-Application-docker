using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Interfaces.Repository;

public interface ISeriesRepository
{
    Task<Series?> GetSeriesAsync(int genreId, int seriesId);
    Task<IEnumerable<Series>> GetSeriesAsync(int genreId);
    Task<Series?> InsertSeriesAsync(int genreId, Series series);
    Task<bool> UpdateSeriesAsync(int genreId, int seriesId, Series series);
    Task<bool> DeleteSeriesAsync(int genreId, int seriesId);
}
