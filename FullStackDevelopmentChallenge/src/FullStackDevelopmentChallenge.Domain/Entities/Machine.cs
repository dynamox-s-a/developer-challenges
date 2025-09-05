using System;
using System.Collections.Generic;

namespace FullStackDevelopmentChallenge.Domain.Entities;

public partial class Machine
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string SerialNumber { get; set; } = null!;

    public string? Description { get; set; }

    public Guid MachineTypeId { get; set; }

    public virtual MachineType MachineType { get; set; } = null!;
}
