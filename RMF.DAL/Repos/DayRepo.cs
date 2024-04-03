using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class DayRepo : MeetingContext, IDayRepo
    {
        public DayRepo()
        {
        }

        public DayRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public async Task<IEnumerable<Day>> GetAll() => 
            await Day.OrderBy(x=> x.Order).ToListAsync();
    }
}
