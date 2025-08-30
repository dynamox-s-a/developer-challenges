using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using Moq;

namespace CommonTestUtilities.Repositories;
public class MachineRepositoryBuilder
{
    private readonly Mock<IMachineRepository> _repository;

    public MachineRepositoryBuilder()
    {
        _repository = new Mock<IMachineRepository>();
    }
    public MachineRepositoryBuilder GetAll(List<Machine> machines)
    {
        _repository.Setup(r => r.GetAllAsync()).ReturnsAsync(machines);
        return this;
    }
    public MachineRepositoryBuilder GetById(Machine? machine)
    {
        if (machine != null)
        {
            _repository.Setup(r => r.GetByIdAsync(machine.Id))
                       .ReturnsAsync(machine);
        }
        return this;
    }
    public MachineRepositoryBuilder GetByIdAny(List<Machine> machines)
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
                   .ReturnsAsync((Guid id) => machines.FirstOrDefault(m => m.Id == id));
        return this;
    }
    public IMachineRepository Build() => _repository.Object;
}
