namespace TVShowApplication.Core.Models.DTO.User;

public class GetUserDTO
{
    public int Id { get; set; }
    public string Email { get; set; }
    public IEnumerable<string> Reviews { get; set; }
}
