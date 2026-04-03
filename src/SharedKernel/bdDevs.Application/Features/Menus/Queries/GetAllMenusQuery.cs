using bdDevs.Contracts.Responses;
using bdDevs.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Application.Features.Menus.Queries;

public record GetAllMenusQuery : IRequest<List<MenuDto>>;

public class GetAllMenusQueryHandler : IRequestHandler<GetAllMenusQuery, List<MenuDto>>
{
    private readonly CoreDbContext _context;

    public GetAllMenusQueryHandler(CoreDbContext context)
    {
        _context = context;
    }

    public async Task<List<MenuDto>> Handle(GetAllMenusQuery query, CancellationToken cancellationToken)
    {
        var menus = await _context.Menus
            .OrderBy(m => m.Sororder)
            .ThenBy(m => m.MenuName)
            .Select(m => new MenuDto
            {
                MenuId = m.MenuId,
                ModuleId = m.ModuleId,
                MenuName = m.MenuName,
                MenuPath = m.MenuPath,
                ParentMenu = m.ParentMenu,
                Sororder = m.Sororder,
                Todo = m.Todo,
                IsActive = m.IsActive
            })
            .ToListAsync(cancellationToken);

        return menus;
    }
}
