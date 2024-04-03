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
    public class PageIndexRepo : MeetingContext, IPageIndexRepo
    {
        public PageIndexRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public PageIndexRepo()
        {
        }

        public async Task<IEnumerable<PageIndex>> GetAll() =>
            await PageIndex.ToListAsync();
    }
}
