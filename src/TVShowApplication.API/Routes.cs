namespace TVShowApplication.API;

public static class Routes
{
    public const string GetGenres = "api/genre";
    public const string CreateGenre = "api/genre";
    public const string GetGenreById = "api/genre/{id:int}";
    public const string UpdateGenre = "api/genre/{id:int}";
    public const string DeleteGenre = "api/genre/{id:int}";

    public const string GetSeries = "api/genre/{genreId:int}/series";
    public const string CreateSeries = "api/genre/{genreId:int}/series";
    public const string GetSeriesById = "api/genre/{genreId:int}/series/{seriesId:int}";
    public const string UpdateSeries = "api/genre/{genreId:int}/series/{seriesId:int}";
    public const string DeleteSeries = "api/genre/{genreId:int}/series/{seriesId:int}";

    public const string GetReviews = "api/genre/{genreId:int}/series/{seriesId:int}/review";
    public const string CreateReview = "api/genre/{genreId:int}/series/{seriesId:int}/review";
    public const string GetReviewById = "api/genre/{genreId:int}/series/{seriesId:int}/review/{reviewId:int}";
    public const string UpdateReview = "api/genre/{genreId:int}/series/{seriesId:int}/review/{reviewId:int}";
    public const string DeleteReview = "api/genre/{genreId:int}/series/{seriesId:int}/review/{reviewId:int}";

    public const string GetUser = "api/user/{userId:int}";
}
