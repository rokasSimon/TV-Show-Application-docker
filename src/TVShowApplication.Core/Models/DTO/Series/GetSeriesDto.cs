namespace TVShowApplication.Core.Models.DTO.Series;

public class GetSeriesDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string CoverImagePath { get; set; }
    public IEnumerable<string> Directors { get; set; }
    public IEnumerable<string> StarringCast { get; set; }

    public Link Poster { get; set; }
    public IEnumerable<string> Genres { get; set; }
    public IEnumerable<string> Reviews { get; set; }
}
