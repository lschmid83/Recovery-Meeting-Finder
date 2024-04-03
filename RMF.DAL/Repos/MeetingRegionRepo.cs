using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Models;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class MeetingRegionRepo : MeetingContext, IMeetingRegionRepo
    {
        public bool IncludeDependencies = true;

        public MeetingRegionRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public MeetingRegionRepo()
        {
        }

        public async Task<IEnumerable<Meeting>> Get(MeetingQuery meetingQuery)
        {
            // Get meeting IDs for region.
            var meetingIds = await MeetingRegion
                .Where(x => x.RegionId == meetingQuery.regionId)
                .Select(x => x.MeetingId)
                .ToListAsync();

            IQueryable<Meeting> query = Meeting;

            if (meetingQuery.typeIds != null)
                query = query.Where(x => meetingQuery.typeIds.Contains(x.TypeId));

            query = query.Where(x => meetingIds.Contains(x.Id));
                  
            if (meetingQuery.dayIds != null)
                query = query.Where(x => meetingQuery.dayIds.Contains(x.DayId));

            if (meetingQuery.hearing != null)
                query = query.Where(x => x.Hearing == meetingQuery.hearing);

            if (meetingQuery.wheelchair != null)
                query = query.Where(x => x.Wheelchair == meetingQuery.wheelchair);

            if (meetingQuery.chit != null)
                query = query.Where(x => x.Chit == meetingQuery.chit);

            if (meetingQuery.open != null)
                query = query.Where(x => x.Open == meetingQuery.open);

            if (meetingQuery.startTime != null)
                query = query.Where(x => x.Time.TimeOfDay > meetingQuery.startTime.Value.TimeOfDay);

            if (IncludeDependencies)
            {
                query = query.Include(x => x.Day);
                query = query.Include(x => x.Type);
            }

            return await query.ToListAsync();
        }
    }
}
