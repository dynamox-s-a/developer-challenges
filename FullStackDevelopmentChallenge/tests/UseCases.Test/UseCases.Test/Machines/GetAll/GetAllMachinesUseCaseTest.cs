using CommonTestUtilities.Entities;
using CommonTestUtilities.Mapper;
using CommonTestUtilities.Repositories;
using FluentAssertions;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetAll;
using FullStackDevelopmentChallenge.Domain.Entities;

namespace UseCases.Test.Machines.GetAll;
public class GetAllMachinesUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var machineType = MachineTypeBuilder.Build();   
        var machineList = MachineBuilder.Collection(machineType);

        var useCase = CreateUseCase(machineList);

        var result = await useCase.GetAllMachines();

        result.Should().NotBeNull();
        result.Machines.Should().NotBeNullOrEmpty().And.AllSatisfy(machine =>
        {
            machine.Id.Should().NotBe(Guid.Empty);
            machine.Name.Should().NotBeNullOrEmpty();
            machine.SerialNumber.Should().NotBeNullOrEmpty();
            machine.MachineType.Should().Be(machineType.TypeName);
        });
    }

    private GetAllMachinesUseCase CreateUseCase(List<Machine> machineList)
    {
        var repository = new MachineRepositoryBuilder().GetAll(machineList).Build();
        var mapper = MapperBuilder.Build();

        return new GetAllMachinesUseCase(repository, mapper);
    }
}
