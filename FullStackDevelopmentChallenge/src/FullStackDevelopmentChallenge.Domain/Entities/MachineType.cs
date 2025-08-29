using System;
using System.Collections.Generic;

namespace FullStackDevelopmentChallenge.Domain.Entities;

public partial class MachineType
{
    public Guid Id { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Machine> Machines { get; set; } = new List<Machine>();
}
