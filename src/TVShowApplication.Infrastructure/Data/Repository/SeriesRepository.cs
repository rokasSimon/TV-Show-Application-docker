using Microsoft.EntityFrameworkCore;
using TVShowApplication.Core.Common.Exceptions;
using TVShowApplication.Core.Common.Extensions;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Repository;

public class SeriesRepository : ISeriesRepository
{
    private readonly TVShowContext _context;
    private readonly IUserDataProvider _userDataProvider;

    public SeriesRepository(TVShowContext context, IUserDataProvider userDataProvider)
    {
        _context = context;
        _userDataProvider = userDataProvider;
    }

    //public async Task<Series?> InsertSeriesAsync(Series series)
    //{
    //    Fault.IfMissingRole(_userDataProvider.UserRole, Role.Admin, Role.Poster);

    //    var genreIds = series.Genres.Select(series => series.Id);
    //    var genresFromDb = await _context.Genres
    //        .Where(g => genreIds.Contains(g.Id))
    //        .ToListAsync();

    //    if (series.Genres.Count != genresFromDb.Count) return null;
    //    series.Genres = genresFromDb;

    //    var posterFromDb = await _context.Posters.SingleOrDefaultAsync(p => p.Id == series.Poster.Id);
    //    if (posterFromDb == null) return null;
    //    series.Poster = posterFromDb;

    //    var createdSeries = await _context.Series.AddAsync(series);
    //    var successfullyCreated = await SaveAsync();

    //    if (successfullyCreated)
    //    {
    //        return createdSeries.Entity;
    //    }

    //    return null;
    //}

    //public async Task<bool> UpdateSeriesAsync(int id, Series series)
    //{
    //    Fault.IfMissingRole(_userDataProvider.UserRole, Role.Admin, Role.Poster);

    //    var seriesToUpdate = await _context.Series.SingleOrDefaultAsync(x => x.Id == id);
    //    if (seriesToUpdate == null) return false;

    //    seriesToUpdate.Description = series.Description;
    //    seriesToUpdate.Directors = series.Directors;
    //    seriesToUpdate.StarringCast = series.StarringCast;

    //    _context.Series.Update(seriesToUpdate);

    //    return await SaveAsync();
    //}

    private async Task<bool> SaveAsync()
    {
        return await _context.SaveChangesAsync() != 0;
    }

    public async Task<Series?> GetSeriesAsync(int genreId, int seriesId)
    {
        var genre = await _context.Genres
            .Include(g => g.Videos)
                .ThenInclude(v => v.Reviews)
            .Include(g => g.Videos)
                .ThenInclude(v => v.Genres)
            .Include(g => g.Videos)
                .ThenInclude(v => v.Poster)
            .SingleOrDefaultAsync(x => x.Id == genreId);

        if (genre == null) throw new ResourceNotFoundException($"There is no such genre: '{genreId}'.");

        return genre.Videos.SingleOrDefault(x => x.Id == seriesId);
    }

    public async Task<IEnumerable<Series>> GetSeriesAsync(int genreId)
    {
        var genre = await _context.Genres
            .Include(g => g.Videos)
                .ThenInclude(v => v.Reviews)
            .Include(g => g.Videos)
                .ThenInclude(v => v.Genres)
            .Include(g => g.Videos)
                .ThenInclude(v => v.Poster)
            .SingleOrDefaultAsync(x => x.Id == genreId);

        if (genre == null) throw new ResourceNotFoundException($"There is no such genre: '{genreId}'.");

        return genre.Videos;
    }

    public async Task<Series?> InsertSeriesAsync(int genreId, Series series)
    {
        Fault.IfMissingRole(_userDataProvider.UserRole, Role.Admin, Role.Poster);

        var genreIds = series.Genres
            .Select(series => series.Id)
            .Append(genreId)
            .Distinct();
        var genresFromDb = await _context.Genres
            .Where(g => genreIds.Contains(g.Id))
            .ToListAsync();

        if (genreIds.Count() != genresFromDb.Count) return null;
        series.Genres = genresFromDb;

        var posterFromDb = await _context.Posters.SingleOrDefaultAsync(p => p.Id == series.Poster.Id);
        if (posterFromDb == null) return null;
        series.Poster = posterFromDb;

        var createdSeries = await _context.Series.AddAsync(series);
        var successfullyCreated = await SaveAsync();

        if (successfullyCreated)
        {
            return createdSeries.Entity;
        }

        return null;
    }

    public async Task<bool> UpdateSeriesAsync(int genreId, int seriesId, Series series)
    {
        Fault.IfMissingRole(_userDataProvider.UserRole, Role.Admin, Role.Poster);

        var genre = await _context.Genres
            .Include(g => g.Videos)
                .ThenInclude(v => v.Poster)
            .SingleOrDefaultAsync(x => x.Id == genreId);
        if (genre == null) throw new ResourceNotFoundException($"There is no such genre: '{genreId}'.");

        var seriesToUpdate = genre.Videos.SingleOrDefault(x => x.Id == seriesId);
        if (seriesToUpdate == null) throw new ResourceNotFoundException($"There is no such series: '{seriesId}'.");

        seriesToUpdate.Description = series.Description;
        seriesToUpdate.Directors = series.Directors;
        seriesToUpdate.StarringCast = series.StarringCast;

        _context.Series.Update(seriesToUpdate);

        return await SaveAsync();
    }

    public async Task<bool> DeleteSeriesAsync(int genreId, int seriesId)
    {
        Fault.IfMissingRole(_userDataProvider.UserRole, Role.Admin, Role.Poster);

        var genre = await _context.Genres
            .Include(g => g.Videos)
            .SingleOrDefaultAsync(x => x.Id == genreId);
        if (genre == null) throw new ResourceNotFoundException($"There is no such genre: '{genreId}'.");

        var seriesToDelete = genre.Videos.SingleOrDefault(x => x.Id == seriesId);
        if (seriesToDelete == null) throw new ResourceNotFoundException($"There is no such series: '{seriesId}'.");

        _context.Series.Remove(seriesToDelete);

        return await SaveAsync();
    }
}
