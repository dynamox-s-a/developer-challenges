namespace Dynapredict.Domain.Entities;

public class Machine
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string? Description { get; set; }

    public int MachineTypeId { get; set; }
    public MachineType? MachineType { get; set; }
}