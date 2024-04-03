using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class MeetingFormatRepo : MeetingContext, IMeetingFormatRepo
    {
        public MeetingFormatRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public MeetingFormatRepo()
        {
        }

        public async Task<IEnumerable<MeetingFormat>> Get(IEnumerable<int> formatIds) => 
            await MeetingFormat.Where(x => formatIds.Contains(x.FormatId)).ToListAsync();
    }
}
