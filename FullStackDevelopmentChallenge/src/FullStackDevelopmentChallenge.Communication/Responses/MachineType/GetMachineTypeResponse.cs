using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FullStackDevelopmentChallenge.Communication.Responses.MachineType;
public class GetMachineTypeResponse
{
    public string TypeName { get; set; } = null!;
    public Guid Id { get; set; }
}
