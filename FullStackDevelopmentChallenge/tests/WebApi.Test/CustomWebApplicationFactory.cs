using CommonTestUtilities.Entities;
using FullStackDevelopmentChallenge.Domain.Entities;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System.Reflection.PortableExecutable;
using WebApi.Test.Resources;


namespace WebApi.Test;
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public MachineHelper Machine_Helper { get; private set; } = default!;
    public MachineTypeHelper Machine_Type_Helper { get; private set; } = default!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Test")
            .ConfigureServices(services =>
            {
                var provider = services.AddEntityFrameworkInMemoryDatabase().BuildServiceProvider();

                services.AddDbContext<FullStackDevelopmentChallengeDbContext>(config =>
                {
                    config.UseInMemoryDatabase("InMemoryDbForTesting");
                    config.UseInternalServiceProvider(provider);
                });

                var scope = services.BuildServiceProvider().CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<FullStackDevelopmentChallengeDbContext>();

                StartDatabase(dbContext);
            });
    }

    private void StartDatabase(
        FullStackDevelopmentChallengeDbContext dbContext)
    {
        var machineType = AddMachineType(dbContext);

        var machine = AddMachine(dbContext, machineType);    

        dbContext.SaveChanges();
    }

    private FullStackDevelopmentChallenge.Domain.Entities.Machine AddMachine(
       FullStackDevelopmentChallengeDbContext dbContext, MachineType MachineType)
    {
        var machine = MachineBuilder.Build(MachineType);
        machine.Id = Guid.NewGuid();

        dbContext.Machines.Add(machine);

        Machine_Helper = new MachineHelper(machine);
        return machine;
    }
    private FullStackDevelopmentChallenge.Domain.Entities.MachineType AddMachineType(
       FullStackDevelopmentChallengeDbContext dbContext)
    {
        var machineType = MachineTypeBuilder.Build();

        Machine_Type_Helper = new MachineTypeHelper(machineType);

        dbContext.MachineTypes.Add(machineType);

        return machineType;
    }
}