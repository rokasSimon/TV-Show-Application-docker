namespace TVShowApplication.Core.Models.DTO.Review;

public class CreateReviewDto
{
    public string Text { get; set; }
    public int Rating { get; set; }
    public int Series { get; set; }
    public int User { get; set; }
}
