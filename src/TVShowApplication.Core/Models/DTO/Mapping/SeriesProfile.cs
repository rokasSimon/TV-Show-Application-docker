using AutoMapper;
using TVShowApplication.Core.Models.DTO.Series;

namespace TVShowApplication.Core.Models.DTO.Mapping;

public class SeriesProfile : Profile
{
    public SeriesProfile()
    {
        CreateMap<Entity.Series, GetSeriesDto>()
            .ForMember(dest => dest.Poster, opt => opt.MapFrom(src => new Link { Href = $"/user/{src.Poster.Id}" }))
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres.Select(x => $"/genre/{x.Id}")))
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews.Select(x => $"/genre/{src.Genres.First().Id}/series/{src.Id}/review/{x.Id}")));
        CreateMap<CreateSeriesDto, Entity.Series>()
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres.Select(x => new Entity.Genre { Id = x })))
            .ForMember(dest => dest.Poster, opt => opt.MapFrom(src => new Entity.Poster { Id = src.Poster }));
        CreateMap<UpdateSeriesDto, Entity.Series>();
    }
}
