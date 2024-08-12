using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TVShowApplication.Core.Common.Exceptions;

namespace TVShowApplication.API.Attributes;

public class MappedExceptionFilterAttribute : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        ProblemDetails problemDetails;

        switch (context.Exception)
        {
            case UnauthorizedException auth: problemDetails = new ProblemDetails
            {
                Type = "Unauthorized",
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized"
            }; break;
            default: return;
        }
    }
}
