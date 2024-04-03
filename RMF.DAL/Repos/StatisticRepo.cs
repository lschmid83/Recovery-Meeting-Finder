using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class StatisticRepo : MeetingContext, IStatisticRepo
    {
        public StatisticRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public StatisticRepo()
        {
        }

        public async Task<IEnumerable<Statistic>> GetLatest()
        {
            // Select max date.
            var latestDate = Statistic.OrderByDescending(x => x.LastUpdated)
                   .Select(x => x.LastUpdated)
                   .FirstOrDefault();

            // Query database for statistics with max date.
            IQueryable<Statistic> query = Statistic;
            query = query.Where(x => x.LastUpdated.Day == latestDate.Day &&
                x.LastUpdated.Month == latestDate.Month &&
                x.LastUpdated.Year == latestDate.Year)
                .Include(x => x.Type)
                .Include(x => x.Country)
                .OrderBy(x => x.Type.ShortName);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Statistic>> GetAll() =>
                await Statistic
                .Include(x => x.Type)
                .Include(x => x.Country)
                .OrderBy(x => x.LastUpdated)
                .ToListAsync();
    }
}
