namespace TaskManager.DTOs.Tasks
{
    public record TaskReadDto(
        int Id,
        string Title,
        bool IsDone,
        int UserId
    );
}
