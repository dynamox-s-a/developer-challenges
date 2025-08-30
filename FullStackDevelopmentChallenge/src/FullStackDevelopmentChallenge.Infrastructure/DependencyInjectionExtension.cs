using FullStackDevelopmentChallenge.Domain.Repositories;
using FullStackDevelopmentChallenge.Domain.Repositories.Specific;
using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
using FullStackDevelopmentChallenge.Infrastructure.DataAcess;
using FullStackDevelopmentChallenge.Infrastructure.DataAcess.Repositories.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FullStackDevelopmentChallenge.Infrastructure;
public static class DependencyInjectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        AddRepositories(services);
        AddDbContext(services, configuration);
    }

    private static void AddDbContext(IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<FullStackDevelopmentChallengeDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("Connection"))
       .EnableSensitiveDataLogging()
       .EnableDetailedErrors()
       .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
        );
    }

    private static void AddRepositories(IServiceCollection services)
    {
        services.AddScoped<IMachineRepository, MachineRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
}

