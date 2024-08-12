using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.API;
using TVShowApplication.API.Attributes;
using TVShowApplication.Core.Models.Entity;
using TVShowApplication.Core.Models.DTO.Series;

namespace TVShowApplication.Controllers
{
    [ApiController]
    [Authorize]
    public class SeriesController : ControllerBase
    {
        private readonly ISeriesRepository _repository;
        private readonly IMapper _mapper;

        // TODO: {{hostname}}/api/genre/2/series/1/reviews

        public SeriesController(ISeriesRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        [Route(Routes.GetSeries)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetSeries(int genreId)
        {
            var series = await _repository.GetSeriesAsync(genreId);

            if (series == null) return NotFound();

            return Ok(_mapper.Map<IEnumerable<GetSeriesDto>>(series));
        }

        [HttpGet]
        [Route(Routes.GetSeriesById)]
        [AuthorizeRoles(Role.User, Role.Poster, Role.Admin)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetSeriesById(int genreId, int seriesId)
        {
            var series = await _repository.GetSeriesAsync(genreId, seriesId);

            if (series == null) return NotFound();

            return Ok(_mapper.Map<GetSeriesDto>(series));
        }

        [HttpPost]
        [Route(Routes.CreateSeries)]
        [AuthorizeRoles(Role.Admin, Role.Poster)]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateSeries(int genreId, [FromBody] CreateSeriesDto createSeriesRequest)
        {
            var series = _mapper.Map<Series>(createSeriesRequest);

            var createdSeries = await _repository.InsertSeriesAsync(genreId, series);
            if (createdSeries == null) return BadRequest();

            return CreatedAtAction(nameof(GetSeriesById), new { genreId = genreId, seriesId = createdSeries.Id }, _mapper.Map<GetSeriesDto>(createdSeries));
        }

        [HttpPatch]
        [Route(Routes.UpdateSeries)]
        [AuthorizeRoles(Role.Admin, Role.Poster)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateSeries(int genreId, int seriesId, [FromBody] UpdateSeriesDto updateSeriesRequest)
        {
            var series = _mapper.Map<Series>(updateSeriesRequest);

            var success = await _repository.UpdateSeriesAsync(genreId, seriesId, series);

            if (!success) return NotFound();

            return Ok();
        }

        [HttpDelete]
        [Route(Routes.DeleteSeries)]
        [AuthorizeRoles(Role.Admin, Role.Poster)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteSeries(int genreId, int seriesId)
        {
            var success = await _repository.DeleteSeriesAsync(genreId, seriesId);

            if (!success) return NotFound();

            return Ok();
        }
    }
}
