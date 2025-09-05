using System.Net.Http.Json;


namespace WebApi.Test;
public class FullStackDevelopmentChallengeClassFixture : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _httpClient;

    protected const string METHOD = "Machine";

    public FullStackDevelopmentChallengeClassFixture(CustomWebApplicationFactory webApplicationFactory)
    {
        _httpClient = webApplicationFactory.CreateClient();
    }

    protected async Task<HttpResponseMessage> RequestPost(
        string requestUri,
        object request
       )
    {

        return await _httpClient.PostAsJsonAsync(requestUri, request);
    }


    protected async Task<HttpResponseMessage> RequestGet(
        string requestUri
        )
    {

        return await _httpClient.GetAsync(requestUri);
    }

}