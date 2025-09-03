using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Filters
{
    public class EnumSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type.IsEnum)
            {
                var enumValues = Enum.GetNames(context.Type)
                    .Select(name => (IOpenApiAny)new OpenApiString($"{(int)Enum.Parse(context.Type, name)} - {name}"));

                schema.Enum = enumValues.ToList();
                schema.Type = "string";
                schema.Format = null;
            }
        }
    }
}
