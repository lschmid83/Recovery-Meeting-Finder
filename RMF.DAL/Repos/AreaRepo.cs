using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class AreaRepo : MeetingContext, IAreaRepo
    {
        public AreaRepo()
        {
        }

        public AreaRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public async Task<IEnumerable<Area>> GetAll()
        {
            IQueryable<Area> query = Area.OrderBy(x=> x.Order);
            query = query.Include(x => x.Regions).ThenInclude(x=> x.Country);
            foreach (var area in query)
                area.Regions = area.Regions.OrderBy(x => x.Name).ToList();
            return await query.ToListAsync();
        }
    }
}
