using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Core.Common.Interfaces.Repository;

public interface IReviewRepository
{
    Task<Review> GetReviewAsync(int genreId, int seriesId, int reviewId);
    Task<IEnumerable<Review>> GetReviewAsync(int genreId, int seriesId);
    Task<Review?> InsertReviewAsync(int genreId, int seriesId, Review review);
    Task<bool> UpdateReviewAsync(int genreId, int seriesId, int reviewId, Review review);
    Task<bool> DeleteReviewAsync(int genreId, int seriesId, int reviewId);
}
