namespace TVShowApplication.Core.Models.DTO.Review;

public class GetReviewDto
{
    public int Id { get; set; }
    public DateTime PostDate { get; set; }
    public string Text { get; set; }
    public int Rating { get; set; }

    public Link ReviewedSeries { get; set; }
    public Link? Reviewer { get; set; }
}
