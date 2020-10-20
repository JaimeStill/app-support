using System.Linq;
using AppSupport.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace AppSupport.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Branch> Branches { get; set; }
        public DbSet<Manifest> Manifests { get; set; }
        public DbSet<ManifestPlane> ManifestPlanes { get; set; }
        public DbSet<ManifestPlanePerson> ManifestPlanePeople { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<Plane> Planes { get; set; }
        public DbSet<Rank> Ranks { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplatePlane> TemplatePlanes { get; set; }
        public DbSet<TemplatePlanePerson> TemplatePlanePeople { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<Person>()
                .HasMany(x => x.PersonManifestPlanes)
                .WithOne(x => x.Person)
                .HasForeignKey(x => x.PersonId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Person>()
                .HasMany(x => x.PersonTemplatePlanes)
                .WithOne(x => x.Person)
                .HasForeignKey(x => x.PersonId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Plane>()
                .HasMany(x => x.PlaneManifests)
                .WithOne(x => x.Plane)
                .HasForeignKey(x => x.PlaneId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Plane>()
                .HasMany(x => x.PlaneTemplates)
                .WithOne(x => x.Plane)
                .HasForeignKey(x => x.PlaneId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Model
                .GetEntityTypes()
                .ToList()
                .ForEach(x =>
                {
                    modelBuilder
                        .Entity(x.Name)
                        .ToTable(x.Name.Split('.').Last());
                });
        }
    }
}
