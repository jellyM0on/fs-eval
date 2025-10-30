using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

using TaskManager.Data;
using TaskManager.Models;
using TaskManager.DTOs.Users;
using TaskManager.Auth; 

namespace TaskManager.API
{
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _hasher;

        public UsersController(ApplicationDbContext context, IPasswordHasher<User> hasher)
            {
                _context = context;
                _hasher = hasher;
            }

        [HttpGet("{id:int}")]
        [DemoAuth]
        public async Task<ActionResult<UserReadDto>> GetById(int id, CancellationToken ct)
        {
            var currentUserId = HttpContext.GetUserId();
            if (currentUserId is null || currentUserId.Value != id) 
            {
                return Forbid();
            }

            var user = await _context.Users
                .Where(user => user.Id == id)
                .Select(user => new UserReadDto(user.Id, user.Email))
                .FirstOrDefaultAsync(ct);

            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserReadDto>> Register([FromBody] UserRegisterDto dto, CancellationToken ct)
        {
            if (await _context.Users.AnyAsync(user => user.Email == dto.Email, ct))
            {
                return BadRequest("Email already registered.");
            };

            var user = new User
            {
                Email = dto.Email,
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync(ct);

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new UserReadDto(user.Id, user.Email));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserLoginResponseDto>> Login([FromBody] UserLoginDto dto, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(user => user.Email == dto.Email, ct);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            };

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid email or password.");
            };

            return Ok(new UserLoginResponseDto(user.Id, user.Email, "Use header: X-Demo-UserId: " + user.Id));
        }
    
    }
}