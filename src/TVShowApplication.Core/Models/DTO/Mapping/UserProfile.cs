using AutoMapper;
using TVShowApplication.Core.Models.DTO.User;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Data.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, GetUserDTO>()
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews.Select(x => $"/genre/{x.ReviewedSeries.Genres.First().Id}/series/{x.ReviewedSeries.Id}/review/{x.Id}")));
    }
}
