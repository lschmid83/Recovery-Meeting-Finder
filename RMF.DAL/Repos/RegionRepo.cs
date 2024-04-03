using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class RegionRepo : MeetingContext, IRegionRepo
    {
        public RegionRepo()
        {
        }

        public RegionRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public async Task<Region> Get(string regionName) =>
            await Region.Where(x => x.Name == regionName).Include(x=> x.Country).FirstOrDefaultAsync();


        public async Task<Region> Get(int regionId) =>  
            await Region.Where(x=> x.Id == regionId).Include(x=> x.Country).FirstOrDefaultAsync();
    }
}
