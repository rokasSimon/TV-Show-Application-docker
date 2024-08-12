namespace TVShowApplication.Core.Common.Exceptions;

public class UnauthenticatedException : Exception
{
    public UnauthenticatedException(string? message) : base(message)
    {
    }
}
