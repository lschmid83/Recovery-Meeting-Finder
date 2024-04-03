using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using RMF.DAL.Entities;
using RMF.DAL.Models;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class MeetingRepo : MeetingContext, IMeetingRepo
    {
        public bool IncludeDependencies = true; // For in-memory unit testing ignore dependent tables.

        public MeetingRepo()
        {
        }

        public MeetingRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public async Task<IEnumerable<Meeting>> GetAll(string type)
        {
            return await Meeting.Where(x => x.Type.ShortName == type)
                .Include(x => x.Day)
                .Include(x => x.Type)
                .ToListAsync();
        }

        public async Task<IEnumerable<Meeting>> Get(MeetingQuery meetingQuery)
        {
            IQueryable<Meeting> query = Meeting;

            if (meetingQuery.typeIds != null)
                query = query.Where(x => meetingQuery.typeIds.Contains(x.TypeId));

            if (meetingQuery.meetingIds != null)
                query = query.Where(x => meetingQuery.meetingIds.Contains(x.Id));

            if (meetingQuery.longitude != null && meetingQuery.latitude != null && meetingQuery.distance != null)
            {
                var location = new Point(meetingQuery.longitude.Value, meetingQuery.latitude.Value) { SRID = 4326 }; 
                if(meetingQuery.venue)
                    query = query.Where(x => x.Location.X == meetingQuery.longitude && x.Location.Y == meetingQuery.latitude);
                else
                    query = query.OrderBy(x => x.Location.Distance(location))
                        .Where(x => x.Location.Distance(location) <= meetingQuery.distance);
            }

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
