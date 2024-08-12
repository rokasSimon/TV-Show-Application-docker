namespace TVShowApplication.Core.Models.Entity;

public class User
{
    public Role Role = Role.User;

    public int Id { get; set; }
    public string Email { get; set; }
    public string HashedPassword { get; set; }
    public string Salt { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }

    public ICollection<Review> Reviews { get; set; }
}
