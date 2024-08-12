namespace TVShowApplication.Core.Models.Entity;

public class Series
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? CoverImagePath { get; set; }
    public ICollection<string>? Directors { get; set; }
    public ICollection<string>? StarringCast { get; set; }

    public Poster Poster { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Genre> Genres { get; set; }
}
