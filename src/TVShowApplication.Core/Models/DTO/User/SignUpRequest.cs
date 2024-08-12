using System.ComponentModel.DataAnnotations;

namespace TVShowApplication.Core.Models.DTO.User;

public class SignUpRequest
{
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string Email { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Password { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string RoleSecret { get; set; }
}
