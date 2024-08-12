namespace TVShowApplication.Core.Models.Entity;

public class Review
{
    public int Id { get; set; }
    public DateTime PostDate { get; set; }
    public string Text { get; set; }
    public int Rating { get; set; }

    public Series ReviewedSeries { get; set; }
    public User? Reviewer { get; set; }
}
