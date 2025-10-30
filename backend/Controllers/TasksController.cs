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

        // [HttpPost]
        // public async Task<IActionResult> Create([FromBody] TaskItem task)
        // {
            
        //     _context.Tasks.Add(task);
        //     await _context.SaveChangesAsync();
        //     return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        // }

        // [HttpPut("{id}")] 
        // public async Task<IActionResult> Update(int id, [FromBody] TaskItem updated)
        // {
        //     var task = await _context.Tasks.FindAsync(id);
        //     if (task == null) return NotFound();

        //     task.Title = updated.Title;
        //     task.IsDone = updated.IsDone;
        //     await _context.SaveChangesAsync();

        //     return Ok(task);
        // }

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
