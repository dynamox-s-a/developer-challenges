using FullStackDevelopmentChallenge.Infraestructure.DataAccess;
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

    }
}

