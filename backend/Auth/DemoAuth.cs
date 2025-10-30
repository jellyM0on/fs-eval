using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

// Only simulates authentication for demo purposes 
namespace TaskManager.Auth
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class DemoAuth : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var header = context.HttpContext.Request.Headers["X-Demo-UserId"].ToString();
            if (string.IsNullOrWhiteSpace(header) || !int.TryParse(header, out var userId))
            {
                context.Result = new UnauthorizedObjectResult(
                    "Add header: X-Demo-UserId: <your user id> (from /users/login)"
                );
                return;
            }

            context.HttpContext.Items["UserId"] = userId;
            await next();
        }
    }

    public static class HttpContextUserExtensions
    {
        public static int? GetUserId(this HttpContext http) =>
            http.Items.TryGetValue("UserId", out var v) && v is int id ? id : null;
    }
}
