using CommonTestUtilities.Entities;
using CommonTestUtilities.Mapper;
using CommonTestUtilities.Repositories;
using CommonTestUtilities.Requests;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.Created;
using FluentAssertions;

namespace UseCases.Test.Machines.Create;

public class CreateMachineUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var machineType = MachineTypeBuilder.Build();   
        var request = CreateMachineRequestBuilder.Build(machineType.Id,machineType.TypeName);
       
        var useCase = CreateUseCase();

        var result = await useCase.CreateMachine(request);

        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
    }

    private CreateMachineUseCase CreateUseCase()
    {
        var repository = new MachineRepositoryBuilder().Build();
        var mapper = MapperBuilder.Build();
        var unitOfWork = UnitOfWorkBuilder.Build();

        return new CreateMachineUseCase(repository, unitOfWork, mapper);
    }
}