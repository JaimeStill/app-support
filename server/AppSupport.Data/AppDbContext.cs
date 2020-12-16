using System.Linq;
using AppSupport.Data.Entities;
using AppSupport.Data.Extensions;
using Microsoft.EntityFrameworkCore;

namespace AppSupport.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Branch> Branches { get; set; }
        public DbSet<Manifest> Manifests { get; set; }
        public DbSet<ManifestPlane> ManifestPlanes { get; set; }
        public DbSet<ManifestPerson> ManifestPeople { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<Plane> Planes { get; set; }
        public DbSet<Query> Queries { get; set; }
        public DbSet<Rank> Ranks { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplatePlane> TemplatePlanes { get; set; }
        public DbSet<TemplatePerson> TemplatePeople { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.SetDefaultQueryValues();

            modelBuilder
                .Entity<Person>()
                .HasOne(x => x.Executive)
                .WithMany(x => x.Associates)
                .HasForeignKey(x => x.ExecutiveId)
                .IsRequired(false);

            modelBuilder
                .Entity<ManifestPerson>()
                .HasOne(x => x.Traveler)
                .WithMany(x => x.Trips)
                .HasForeignKey(x => x.TravelerId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<ManifestPerson>()
                .HasOne(x => x.Organization)
                .WithMany(x => x.ManifestPeople)
                .HasForeignKey(x => x.OrganizationId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<ManifestPerson>()
                .HasOne(x => x.Rank)
                .WithMany(x => x.ManifestPeople)
                .HasForeignKey(x => x.RankId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Person>()
                .HasMany(x => x.ManifestPlanes)
                .WithOne(x => x.Person)
                .HasForeignKey(x => x.PersonId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Person>()
                .HasMany(x => x.TemplatePlanes)
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
