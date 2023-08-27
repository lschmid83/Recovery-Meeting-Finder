using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;

namespace RMF.DAL
{
    public class MeetingContext : DbContext
    {
        public DbSet<MeetingDataDump> MeetingDataDump { get; set; }
        public DbSet<Meeting> Meeting { get; set; }
        public DbSet<Type> Type { get; set; }
        public DbSet<Area> Area { get; set; }
        public DbSet<Region> Region { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<MeetingRegion> MeetingRegion { get; set; }
        public DbSet<Day> Day { get; set; }
        public DbSet<Format> Format { get; set; }
        public DbSet<MeetingFormat> MeetingFormat { get; set; }
        public DbSet<Statistic> Statistic { get; set; }
        public DbSet<PageIndex> PageIndex { get; set; }
        public DbSet<DataDump> DataDump { get; set; }

        public MeetingContext()
        {

        }
        public MeetingContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Disable cascading deletes.
            modelBuilder.Entity<Meeting>()
                .HasOne(p => p.Type)
                .WithMany()
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Format>()
                .HasIndex(p => p.TypeId);

            modelBuilder.Entity<Meeting>()
                .HasIndex(p => new { p.DayId, p.TypeId, p.Hearing, p.Wheelchair, p.Open });

            modelBuilder.Entity<MeetingFormat>()
                .HasIndex(p => new { p.MeetingId, p.FormatId });

            modelBuilder.Entity<Region>()
                .HasIndex(p => new { p.AreaId, p.CountryId });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                @"Data Source=YOUR_SERVER_NAME;Initial Catalog=RMF;Persist Security Info=True;User ID=YOUR_USERNAME;Password=YOUR_PASSWORD",
                options => options.UseNetTopologySuite().EnableRetryOnFailure());
            }
        }
    }
}
