using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using bdDevs.Application.Common.Behaviors;

namespace bdDevs.Application.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        params Type[] assemblyMarkers)
    {
        var assemblies = assemblyMarkers.Select(m => m.Assembly).ToArray();

        services.AddMediatR(cfg =>
        {
            foreach (var asm in assemblies)
                cfg.RegisterServicesFromAssembly(asm);

					// Pipeline order: Logging → Validation → Caching → Handler
					cfg.AddBehavior(typeof(IPipelineBehavior<,>),
													typeof(LoggingBehavior<,>));
					cfg.AddBehavior(typeof(IPipelineBehavior<,>),
													typeof(ValidationBehavior<,>));
					cfg.AddBehavior(typeof(IPipelineBehavior<,>),
													typeof(CachingBehavior<,>));
				});

        foreach (var asm in assemblies)
            services.AddValidatorsFromAssembly(asm);

        return services;
    }
}


