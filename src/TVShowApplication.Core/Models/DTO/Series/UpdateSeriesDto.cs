namespace TVShowApplication.Core.Models.DTO.Series;

public class UpdateSeriesDto
{
    public string? Description { get; set; }
    public string? CoverImagePath { get; set; }
    public IEnumerable<string>? Directors { get; set; }
    public IEnumerable<string>? StarringCast { get; set; }
}
