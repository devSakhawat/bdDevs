//using bdDevs.Infrastructure.Entities;
//using bdDevs.Infrastructure.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace bdDevs.Infrastructure.Data.Configurations;

//public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
//{
//	public void Configure(EntityTypeBuilder<UserProfile> builder)
//	{
//		builder.ToTable("UserProfiles");
//		builder.HasKey(x => x.Id);

//		builder.Property(x => x.FirstName).HasMaxLength(100).IsRequired();
//		builder.Property(x => x.LastName).HasMaxLength(100).IsRequired();
//		builder.Property(x => x.AspNetUserId).HasMaxLength(450).IsRequired();
//		builder.HasIndex(x => x.AspNetUserId).IsUnique();

//		// 1-1 with AppUser
//		builder.HasOne<AppUser>()
//					 .WithOne(u => u.Profile)
//					 .HasForeignKey<UserProfile>(x => x.AspNetUserId)
//					 .HasPrincipalKey<AppUser>(x => x.Id);
//	}
//}
