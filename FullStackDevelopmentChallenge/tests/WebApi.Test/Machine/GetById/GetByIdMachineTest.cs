using FluentAssertions;
using FullStackDevelopmentChallenge.Exceptions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebApi.Test.Machine.GetById;
public class GetByIdMachineTest : FullStackDevelopmentChallengeClassFixture
{
    private readonly Guid _machineId;

    public GetByIdMachineTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
        _machineId = webApplicationFactory.Machine_Helper.GetId();
    }

    [Fact]
    public async Task Success()
    {
        var result = await RequestGet(requestUri: $"{METHOD}/{_machineId}");

        result.StatusCode.Should().Be(HttpStatusCode.OK);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        response.RootElement.GetProperty("id").GetGuid().Should().Be(_machineId);
        response.RootElement.GetProperty("name").GetString().Should().NotBeNullOrWhiteSpace();
        response.RootElement.GetProperty("description").GetString().Should().NotBeNullOrWhiteSpace();
        response.RootElement.GetProperty("serialNumber").GetString().Should().NotBeNullOrWhiteSpace();
        response.RootElement.GetProperty("machineType").GetString().Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Error_Machine_Not_Found()
    {
        var machineIdNotFound = Guid.NewGuid();
        var result = await RequestGet(requestUri: $"{METHOD}/{machineIdNotFound}");

        result.StatusCode.Should().Be(HttpStatusCode.NotFound);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        var errors = response.RootElement.GetProperty("errorMessages").EnumerateArray();

        var expectedMessage = ResourceErrorMessages.ResourceManager.GetString("MACHINE_NOT_FOUND");

        errors.Should().HaveCount(1).And.Contain(error => error.GetString()!.Equals(expectedMessage));
    }
}