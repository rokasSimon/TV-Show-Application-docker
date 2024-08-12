namespace TVShowApplication.Core.Models.DTO.User;

public class AuthenticatedResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}
