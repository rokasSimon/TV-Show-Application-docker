using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVShowApplication.API;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Models.DTO.User;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserManager _userManager;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IUserManager userManager, IMapper mapper)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        [Route(Routes.GetUser)]
        public async Task<IActionResult> GetUser(int userId)
        {
            var user = await _userRepository.GetUserAsync<User>(userId);

            if (user == null) return NotFound();

            return Ok(_mapper.Map<GetUserDTO>(user));
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/user")]
        public async Task<IActionResult> SignUp(SignUpRequest signUpRequest)
        {
            var success = await _userManager.CreateUser(signUpRequest);

            if (!success) return BadRequest();

            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/user/token")]
        public async Task<IActionResult> GetToken(SignInRequest signInRequest)
        {
            var tokens = await _userManager.GetTokenForUser(signInRequest);

            if (tokens == null) return Unauthorized();

            return Ok(tokens);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/user/token/refresh")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest refreshRequest)
        {
            var authentication = await _userManager.RefreshToken(refreshRequest);

            if (authentication == null) return Unauthorized();

            return Ok(authentication);
        }

        [HttpPost]
        [Authorize]
        [Route("api/user/token/revoke")]
        public async Task<IActionResult> RevokeToken()
        {
            await _userManager.Revoke();

            return Ok();
        }
    }
}
