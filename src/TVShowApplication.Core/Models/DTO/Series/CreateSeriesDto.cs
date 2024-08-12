namespace TVShowApplication.Core.Models.DTO.Series;

public class CreateSeriesDto
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? CoverImagePath { get; set; }
    public IEnumerable<string> Directors { get; set; }
    public IEnumerable<string> StarringCast { get; set; }

    public int Poster { get; set; }
    public int[] Genres { get; set; }
}
