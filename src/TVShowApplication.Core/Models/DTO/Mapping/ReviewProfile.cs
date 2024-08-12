using AutoMapper;
using TVShowApplication.Core.Models.DTO.Review;

namespace TVShowApplication.Core.Models.DTO.Mapping;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Entity.Review, GetReviewDto>()
            .ForMember(dest => dest.ReviewedSeries, opt => opt.MapFrom(src => new Link { Href = $"/genre/{src.ReviewedSeries.Genres.First().Id}/series/{src.ReviewedSeries.Id}" }))
            .ForMember(dest => dest.Reviewer, opt => opt.MapFrom(src => src.Reviewer == null ? null : new Link { Href = $"/user/{src.Reviewer.Id}" }));
        CreateMap<CreateReviewDto, Entity.Review>()
            .ForMember(dest => dest.ReviewedSeries, opt => opt.MapFrom(src => new Entity.Series { Id = src.Series }))
            .ForMember(dest => dest.Reviewer, opt => opt.MapFrom(src => new Entity.User { Id = src.User }));
        CreateMap<UpdateReviewDto, Entity.Review>();
    }
}
