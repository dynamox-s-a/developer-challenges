using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using Moq;

namespace CommonTestUtilities.Repositories;
public class MachineTypeRepositoryBuilder
{
    private readonly Mock<IMachineTypeRepository> _repository;

    public MachineTypeRepositoryBuilder()
    {
        _repository = new Mock<IMachineTypeRepository>();
    }
    public MachineTypeRepositoryBuilder GetAll(List<MachineType> machines)
    {
        _repository.Setup(r => r.GetAllAsync()).ReturnsAsync(machines);
        return this;
    }
    public IMachineTypeRepository Build() => _repository.Object;
}
