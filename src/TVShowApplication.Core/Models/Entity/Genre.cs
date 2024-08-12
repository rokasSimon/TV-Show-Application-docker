namespace TVShowApplication.Core.Models.Entity;

public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Series> Videos { get; set; }
}
