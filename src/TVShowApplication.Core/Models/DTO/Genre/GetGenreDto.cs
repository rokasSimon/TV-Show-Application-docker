namespace TVShowApplication.Core.Models.DTO.Genre;

public class GetGenreDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public IEnumerable<string> Series { get; set; }
}
