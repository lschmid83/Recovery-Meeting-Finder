using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class FormatRepo : MeetingContext, IFormatRepo
    {
        public FormatRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public FormatRepo()
        {
        }

        public async Task<IEnumerable<Format>> Get(int typeId) => 
            await Format
                .Where(x => x.TypeId == typeId)
                .OrderBy(x => x.Name)
                .ToListAsync();

    }
}
