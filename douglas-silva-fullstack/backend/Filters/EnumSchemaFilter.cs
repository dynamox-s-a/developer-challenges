using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Linq;

namespace backend.Filters
{
    /// <summary>
    /// Filtro para melhorar a documentação de enums no Swagger
    /// </summary>
    public class EnumSchemaFilter : ISchemaFilter
    {
        /// <summary>
        /// Aplica o filtro ao esquema do Swagger
        /// </summary>
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type.IsEnum)
            {
                var enumValues = Enum.GetNames(context.Type)
                    .Select(name => new OpenApiString($"{(int)Enum.Parse(context.Type, name)} - {name}"));

                schema.Enum = enumValues.ToList();
                schema.Type = "string";
                schema.Format = null;
            }
        }
    }
}
