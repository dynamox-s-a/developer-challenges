using CommonTestUtilities.Entities;
using CommonTestUtilities.Mapper;
using CommonTestUtilities.Repositories;
using FluentAssertions;
using FullStackDevelopmentChallenge.Application.UseCases.MachineTypes;
using FullStackDevelopmentChallenge.Domain.Entities;

namespace UseCases.Test.MachineTypes.GetAll;
public class GetAllMachineTypeUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var machineTypeList = MachineTypeBuilder.Collection();

        var useCase = CreateUseCase(machineTypeList);

        var result = await useCase.GetAllMachineType();

        result.Should().NotBeNull();
        result.MachineTypes.Should().NotBeNullOrEmpty().And.AllSatisfy(machine =>
        {
            machine.Id.Should().NotBe(Guid.Empty);
            machine.TypeName.Should().NotBeNullOrEmpty();
        });
    }

    private GetAllMachineTypeUseCase CreateUseCase(List<MachineType> machineTypeList)
    {
        var repository = new MachineTypeRepositoryBuilder().GetAll(machineTypeList).Build();
        var mapper = MapperBuilder.Build();

        return new GetAllMachineTypeUseCase(repository, mapper);
    }
}