using AutoMapper;
using TVShowApplication.Core.Models.DTO.Genre;

namespace TVShowApplication.Core.Models.DTO.Mapping;

public class GenreProfile : Profile
{
    public GenreProfile()
    {
        CreateMap<CreateGenreDto, Entity.Genre>();
        CreateMap<Entity.Genre, GetGenreDto>()
            .ForMember(dest => dest.Series, opt => opt.MapFrom(src => src.Videos.Select(x => $"/genre/{src.Id}/series/{x.Id}")));
        CreateMap<UpdateGenreDto, Entity.Genre>();
    }
}
