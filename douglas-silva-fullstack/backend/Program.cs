using System.Reflection;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Repositories;
using backend.Services;
using backend.Middleware;
using backend.Extensions;

// Cria o construtor da aplicação web
var builder = WebApplication.CreateBuilder(args);

// Adiciona os controladores da API
builder.Services.AddControllers();

// Configuração do CORS para permitir requisições de diferentes origens
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader()
               .WithExposedHeaders("Content-Disposition");
    });

    options.AddPolicy("ProductionCorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials()
               .WithExposedHeaders("Content-Disposition");
    });
});

// Configuração do DbContext para usar SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// Configuração do Swagger para documentação da API
builder.Services.AddSwaggerDocumentation();

// DI: Repository & Services
builder.Services.AddScoped<IMachineRepository, MachineRepository>();
builder.Services.AddScoped<IMachineService, MachineService>();

// Constrói a aplicação
var app = builder.Build();

// Habilita o Swagger em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

// Habilita o redirecionamento para HTTPS
app.UseHttpsRedirection();

// Habilita o CORS
app.UseCors();

// Adiciona o middleware de tratamento de erros personalizado
app.UseMiddleware<ErrorHandlingMiddleware>();

// Habilita a autorização
app.UseAuthorization();

// Mapeia os controladores
app.MapControllers();

// Inicia a aplicação
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao migrar o banco de dados.");
    }
}

app.Run();