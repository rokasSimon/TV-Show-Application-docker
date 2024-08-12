namespace TVShowApplication.Core.Options;

public class JwtOptions
{
    public const string Jwt = nameof(Jwt);

    public string? Issuer { get; set; }
    public string? Audience { get; set; }
    public string? Secret { get; set; }
    public int? ExpirationSeconds { get; set; }
    public int? RefreshTokenExpirationDays { get; set; }
}
