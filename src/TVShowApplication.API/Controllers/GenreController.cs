using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.API;
using TVShowApplication.API.Attributes;
using TVShowApplication.Core.Models.Entity;
using TVShowApplication.Core.Models.DTO.Genre;

namespace TVShowApplication.Controllers
{
    [ApiController]
    [Authorize]
    public class GenreController : ControllerBase
    {
        private readonly IGenreRepository _repository;
        private readonly IMapper _mapper;

        public GenreController(IGenreRepository repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }

        [HttpGet]
        [Route(Routes.GetGenres)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _repository.GetGenresAsync();

            return Ok(_mapper.Map<IEnumerable<GetGenreDto>>(genres));
        }

        [HttpGet]
        [Route(Routes.GetGenreById)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _repository.GetGenreAsync(id);

            if (genre == null) return NotFound();

            return Ok(_mapper.Map<GetGenreDto>(genre));
        }

        [HttpPost]
        [Route(Routes.CreateGenre)]
        [AuthorizeRoles(Role.Admin)]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateGenre([FromBody] CreateGenreDto createGenreRequest)
        {
            var genre = _mapper.Map<Genre>(createGenreRequest);

            var createdGenre = await _repository.InsertGenreAsync(genre);
            if (createdGenre == null) return BadRequest();

            return CreatedAtAction(nameof(GetGenreById), new { id = createdGenre.Id }, _mapper.Map<GetGenreDto>(createdGenre));
        }

        [HttpPatch]
        [Route(Routes.UpdateGenre)]
        [AuthorizeRoles(Role.Admin)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] UpdateGenreDto updateGenreRequest)
        {
            var genre = _mapper.Map<Genre>(updateGenreRequest);

            var success = await _repository.UpdateGenreAsync(id, genre);

            if (!success) return NotFound();

            return Ok();
        }

        [HttpDelete]
        [Route(Routes.DeleteGenre)]
        [AuthorizeRoles(Role.Admin)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var success = await _repository.DeleteGenreAsync(id);

            if (!success) return NotFound();

            return Ok();
        }
    }
}
