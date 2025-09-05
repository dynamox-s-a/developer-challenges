using CommonTestUtilities.Requests;
using FluentAssertions;
using FullStackDevelopmentChallenge.Exceptions;
using System.Net;
using System.Text.Json;

namespace WebApi.Test.Machine.Create;
public class CreateMachineTest : FullStackDevelopmentChallengeClassFixture
{
    private readonly Guid _machineTypeId;
    private readonly string _machineTypeName;

    public CreateMachineTest(CustomWebApplicationFactory webApplicationFactory) : base(webApplicationFactory)
    {
        _machineTypeId = webApplicationFactory.Machine_Type_Helper.GetId();
        _machineTypeName = webApplicationFactory.Machine_Type_Helper.GetTypeName();
    }

    [Fact]
    public async Task Success()
    {
        var request = CreateMachineRequestBuilder.Build(_machineTypeId,_machineTypeName);

        var result = await RequestPost(METHOD, request);

        result.StatusCode.Should().Be(HttpStatusCode.Created);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        response.RootElement.GetProperty("name").GetString().Should().Be(request.Name);
    }

    [Fact]
    public async Task Error_Empty_Name()
    {
        var request = CreateMachineRequestBuilder.Build(_machineTypeId, _machineTypeName);
        request.Name = string.Empty;

        var result = await RequestPost(requestUri: METHOD, request: request);

        result.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await result.Content.ReadAsStreamAsync();

        var response = await JsonDocument.ParseAsync(body);

        var errors = response.RootElement.GetProperty("errorMessages").EnumerateArray();

        var expectedMessage = ResourceErrorMessages.ResourceManager.GetString("NAME_REQUIRED");

        errors.Should().HaveCount(1).And.Contain(error => error.GetString()!.Equals(expectedMessage));
    }
}