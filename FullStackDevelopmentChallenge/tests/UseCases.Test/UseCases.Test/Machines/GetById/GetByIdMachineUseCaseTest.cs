using CommonTestUtilities.Entities;
using CommonTestUtilities.Mapper;
using CommonTestUtilities.Repositories;
using FluentAssertions;
using FullStackDevelopmentChallenge.Application.UseCases.Machines.GetById;
using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Exceptions;
using FullStackDevelopmentChallenge.Exceptions.ExeceptionsBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UseCases.Test.Machines.GetById;
public class GetByIdMachineUseCaseTest
{
    [Fact]
    public async Task Success()
    {
        var machineType = MachineTypeBuilder.Build();
        var machine = MachineBuilder.Build(machineType);

        var useCase = CreateUseCase(machine);

        var result = await useCase.GetById(machine.Id);

        result.Should().NotBeNull();
        result.Id.Should().Be(machine.Id);
        result.Name.Should().Be(machine.Name);
        result.Description.Should().Be(machine.Description);
        result.SerialNumber.Should().Be(machine.SerialNumber);
        result.MachineType.Should().Be(machine.MachineType.TypeName);
    }

    [Fact]
    public async Task Error_Machine_Not_Found()
    {
        var machineType = MachineTypeBuilder.Build();   
        var machine = MachineBuilder.Build(machineType);

        var machineIdNotFound = Guid.NewGuid();

        var useCase = CreateUseCase();

        var act = async () => await useCase.GetById(id: machineIdNotFound);

        var result = await act.Should().ThrowAsync<NotFoundException>();

        result.Where(ex => ex.GetErrors().Count == 1 && ex.GetErrors().Contains(ResourceErrorMessages.MACHINE_NOT_FOUND));
    }

    private GetByIdMachineUseCase CreateUseCase(Machine? machine = null)
    {
        var repository = new MachineRepositoryBuilder().GetById(machine).Build();
        var mapper = MapperBuilder.Build();

        return new GetByIdMachineUseCase(repository, mapper);
    }
}
