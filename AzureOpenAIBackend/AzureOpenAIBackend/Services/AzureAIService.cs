using Azure.AI.OpenAI;
using Azure.Identity;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using OpenAI;
using Azure.Core;

public class AzureAIService
{
    private readonly OpenAIClient _client;
    private readonly string _deploymentName;

    public AzureAIService(IConfiguration configuration)
    {
        string endpoint = configuration["AzureAI:Endpoint"];
        string apiKey = configuration["AzureAI:ApiKey"];
        _deploymentName = configuration["AzureAI:DeploymentName"];
        _client = new OpenAIClient(new Uri(endpoint), new DefaultAzureCredential());
    }

    public async Task<string> GetResponseFromModelAsync(string query)
    {
        var requestOptions = new CompletionsOptions
        {
            MaxTokens = 1000,
            Temperature = 0.5f
        };

        requestOptions.Prompts.Add(new Prompt(query));

        var result = await _client.GetCompletionsAsync(_deploymentName, requestOptions);
        return result.Value.Completions[0].Text;
    }
}
