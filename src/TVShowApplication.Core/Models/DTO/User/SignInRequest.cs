using System.ComponentModel.DataAnnotations;

namespace TVShowApplication.Core.Models.DTO.User;

public class SignInRequest
{
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Password { get; set; }
}
