
using MediatR;
using Microsoft.AspNetCore.Mvc;
using bdDevs.Contracts.Interfaces;
using bdDevs.Contracts.Responses;

namespace bdDevs.Api.Controllers;

[ApiController]
public abstract class BaseApiController : ControllerBase
{
	private ISender? _mediator;

	protected ISender Mediator =>
			_mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

	protected string? CorrelationId =>
			HttpContext.Items["CorrelationId"]?.ToString();

	// ── Single Resource ──
	protected IActionResult ToLinkedResource<T>(
			T data,
			ILinkFactory<T> factory) =>
			Ok(StandardApiResponse<LinkedResource<T>>.Ok(
					new LinkedResource<T>(data, factory.GetLinks(data)),
					CorrelationId));

	// ── Grid Response ──
	protected IActionResult ToLinkedGrid<T>(
			List<T> items,
			PaginationMetadata pagination,
			List<LinkDto>? collectionLinks = null) =>
			Ok(StandardApiResponse<List<T>>.OkGrid(
					items,
					pagination,
					collectionLinks ?? [],
					CorrelationId));

	// ── Simple OK ──
	protected IActionResult OkResponse<T>(T data) =>
			Ok(StandardApiResponse<T>.Ok(data, CorrelationId));

	// ── Created ──
	protected IActionResult CreatedResponse<T>(
			string routeName,
			object routeValues,
			T data) =>
			CreatedAtRoute(
					routeName,
					routeValues,
					StandardApiResponse<T>.Ok(data, CorrelationId));

	// ── Not Found ──
	protected IActionResult NotFoundResponse(string resource, object id) =>
			NotFound(StandardApiResponse<object>.Fail(
					resource, $"{resource} with id '{id}' not found.", CorrelationId));

	// ── Validation Error ──
	protected IActionResult ValidationFail(string field, string message) =>
			BadRequest(StandardApiResponse<object>.Fail(field, message, CorrelationId));
}