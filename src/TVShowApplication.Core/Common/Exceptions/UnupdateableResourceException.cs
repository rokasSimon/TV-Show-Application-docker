namespace TVShowApplication.Core.Common.Exceptions;

public class UnupdateableResourceException : Exception
{
    public UnupdateableResourceException(string? message) : base(message)
    {
    }
}
