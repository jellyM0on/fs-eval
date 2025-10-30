using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using TaskManager.Models;
using TaskManager.Data;
using TaskManager.DTOs.Tasks;
using TaskManager.Auth;

namespace TaskManager.API
{
    [Route("tasks")]
    [ApiController]
    [DemoAuth]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskReadDto>>> GetAll(CancellationToken ct)
        {
            var userId = HttpContext.GetUserId()!.Value;

            var tasks = await _context.Tasks
                        .Where(task => task.UserId == userId)
                        .Select(task => new TaskReadDto(task.Id, task.Title, task.IsDone, task.UserId))
                        .ToListAsync(ct);

            return Ok(tasks);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskReadDto>> GetById(int id, CancellationToken ct)
        {
            var userId = HttpContext.GetUserId()!.Value;

            var task = await _context.Tasks
                .Where(t => t.Id == id && t.UserId == userId)
                .Select(task => new TaskReadDto(task.Id, task.Title, task.IsDone, task.UserId))
                .FirstOrDefaultAsync(ct);

            if (task == null) return NotFound();

            return Ok(task);
        }

        [HttpPost]
         public async Task<ActionResult<TaskReadDto>> Create([FromBody] TaskCreateDto dto, CancellationToken ct)
        {
            var userId = HttpContext.GetUserId()!.Value;

            var task = new TaskItem
            {
                Title = dto.Title,
                IsDone = dto.IsDone,
                UserId = userId
            }; 

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync(ct);

            var createdTask = new TaskReadDto(task.Id, task.Title, task.IsDone, task.UserId);

            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id:int}")] 
        public async Task<ActionResult<TaskReadDto>> Update(int id, [FromBody] TaskUpdateDto dto, CancellationToken ct)
        {
            if (id != dto.Id) return BadRequest("Route id and body id do not match.");

            var userId = HttpContext.GetUserId()!.Value;
            var task = await _context.Tasks.FirstOrDefaultAsync(task => task.Id == id && task.UserId == userId, ct);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.IsDone = dto.IsDone;
            await _context.SaveChangesAsync();

            var updatedTask = new TaskReadDto(task.Id, task.Title, task.IsDone, task.UserId);

            return Ok(updatedTask);
        }

        // [HttpDelete("{id}")]
        // public async Task<IActionResult> Delete(int id)
        // {
        //     var task = await _context.Tasks.FindAsync(id);
        //     if (task == null) return NotFound();

        //     _context.Tasks.Remove(task);
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }
    }
}
