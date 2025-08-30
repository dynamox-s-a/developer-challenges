using FluentAssertions;
using System.Net;
using System.Text.Json;


namespace WebApi.Test.Machine.GetAll;
public class GetAllMachinesTest : FullStackDevelopmentChallengeClassFixture
{
    public GetAllMachinesTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
    }

    [Fact]
    public async Task Success()
    {
        var result = await RequestGet(requestUri: METHOD);

        result.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        response.RootElement.GetProperty("machines").EnumerateArray().Should().NotBeNullOrEmpty();
    }

}
