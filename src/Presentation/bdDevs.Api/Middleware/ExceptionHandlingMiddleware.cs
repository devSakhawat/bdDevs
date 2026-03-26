using bdDevs.Contracts.Responses;
using FluentValidation;
using System.Net;
using System.Text.Json;

namespace bdDevs.Api.Middleware;

public class ExceptionHandlingMiddleware(
		RequestDelegate next,
		ILogger<ExceptionHandlingMiddleware> logger)
{
	public async Task InvokeAsync(HttpContext context)
	{
		try
		{
			await next(context);
		}
		catch (ValidationException ex)
		{
			var errors = ex.Errors
					.Select(e => new FieldError(e.PropertyName, e.ErrorMessage))
					.ToList();

			await WriteResponse(context, HttpStatusCode.BadRequest,
					StandardApiResponse<object>.Fail(errors,
							context.Items["CorrelationId"]?.ToString()));
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);

			await WriteResponse(context, HttpStatusCode.InternalServerError,
					StandardApiResponse<object>.Fail(
							"server", "An unexpected error occurred.",
							context.Items["CorrelationId"]?.ToString()));
		}
	}

	private static async Task WriteResponse<T>(
			HttpContext context,
			HttpStatusCode statusCode,
			StandardApiResponse<T> response)
	{
		context.Response.ContentType = "application/json";
		context.Response.StatusCode = (int)statusCode;

		var json = JsonSerializer.Serialize(response,
				new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

		await context.Response.WriteAsync(json);
	}
}
