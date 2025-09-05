using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebApi.Test.MachineTypes;
public class GetAllMachineTypeTest : FullStackDevelopmentChallengeClassFixture
{
    public GetAllMachineTypeTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
    }

    [Fact]
    public async Task Success()
    {
        var result = await RequestGet(requestUri: METHOD + "Type");

        result.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        response.RootElement.GetProperty("machineTypes").EnumerateArray().Should().NotBeNullOrEmpty();
    }

}
