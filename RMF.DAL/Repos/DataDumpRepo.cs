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
    public class DataDumpRepo : MeetingContext, IDataDumpRepo
    {
        public DataDumpRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public DataDumpRepo()
        {
        }

        public async Task<IEnumerable<DataDump>> GetAll() =>
            await DataDump.OrderByDescending(x => x.Date).ToListAsync();
    }
}
