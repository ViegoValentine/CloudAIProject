using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AiController : ControllerBase
{
    private readonly AzureAIService _aiService;

    public AiController(AzureAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskQuestion([FromBody] string question)
    {
        var answer = await _aiService.GetResponseFromModelAsync(question);
        return Ok(new { Answer = answer });
    }
}
