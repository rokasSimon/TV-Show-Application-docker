using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.API;
using TVShowApplication.API.Attributes;
using TVShowApplication.Core.Models.Entity;
using TVShowApplication.Core.Models.DTO.Review;

namespace TVShowApplication.Controllers
{
    [ApiController]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _repository;
        private readonly IMapper _mapper;

        public ReviewController(IReviewRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        [Route(Routes.GetReviews)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetReviews(int genreId, int seriesId)
        {
            var reviews = await _repository.GetReviewAsync(genreId, seriesId);

            if (reviews == null) return NotFound();

            return Ok(_mapper.Map<IEnumerable<GetReviewDto>>(reviews));
        }

        [HttpGet]
        [Route(Routes.GetReviewById)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetReviewById(int genreId, int seriesId, int reviewId)
        {
            var review = await _repository.GetReviewAsync(genreId, seriesId, reviewId);

            if (review == null) return NotFound();

            return Ok(_mapper.Map<GetReviewDto>(review));
        }

        [HttpPost]
        [Route(Routes.CreateReview)]
        [AuthorizeRoles(Role.Admin, Role.Poster, Role.User)]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateReview(int genreId, int seriesId, [FromBody] CreateReviewDto createReviewRequest)
        {
            var review = _mapper.Map<Review>(createReviewRequest);

            var createdReview = await _repository.InsertReviewAsync(genreId, seriesId, review);
            if (createdReview == null) return BadRequest();

            return CreatedAtAction(nameof(GetReviewById), new { genreId = genreId, seriesId = seriesId, reviewId = createdReview.Id }, _mapper.Map<GetReviewDto>(createdReview));
        }

        [HttpPatch]
        [Route(Routes.UpdateReview)]
        [AuthorizeRoles(Role.Admin, Role.Poster, Role.User)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateReview(int genreId, int seriesId, int reviewId, [FromBody] UpdateReviewDto updateReviewRequest)
        {
            var review = _mapper.Map<Review>(updateReviewRequest);

            var success = await _repository.UpdateReviewAsync(genreId, seriesId, reviewId, review);

            if (!success) return NotFound();

            return Ok();
        }

        [HttpDelete]
        [Route(Routes.DeleteReview)]
        [AuthorizeRoles(Role.Admin, Role.Poster, Role.User)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteReview(int genreId, int seriesId, int reviewId)
        {
            var success = await _repository.DeleteReviewAsync(genreId, seriesId, reviewId);

            if (!success) return NotFound();

            return Ok();
        }
    }
}
