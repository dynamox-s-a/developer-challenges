using System;

namespace Dynapredict.Api.Models
{
    public class Machine
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // gera Guid automaticamente
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string? Description { get; set; } // opcional
        public int MachineTypeId { get; set; }
        public MachineType MachineType { get; set; } = null!;
    }
}
