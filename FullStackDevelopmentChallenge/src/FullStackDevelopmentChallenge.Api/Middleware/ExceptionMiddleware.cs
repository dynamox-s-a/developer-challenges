using FullStackDevelopmentChallenge.Communication.Responses;
using FullStackDevelopmentChallenge.Exceptions;
using FullStackDevelopmentChallenge.Exceptions.ExeceptionsBase;

namespace FullStackDevelopmentChallenge.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        int statusCode;
        object errorResponse;

        if (exception is FullStackDevelopmentChallengeException cfEx)
        {
            statusCode = cfEx.StatusCode;
            errorResponse = new ResponseError(cfEx.GetErrors());
        }
        else
        {
            statusCode = StatusCodes.Status500InternalServerError;
            errorResponse = new ResponseError(ResourceErrorMessages.UNKNOW_ERROR);
        }

        context.Response.StatusCode = statusCode;

        return context.Response.WriteAsJsonAsync(errorResponse);
    }
}

