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
    public class CountryRepo : MeetingContext, ICountryRepo
    {
        public CountryRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public CountryRepo()
        {
        }

        public async Task<IEnumerable<Country>> GetAll() =>
            await Country.OrderBy(x => x.Order).ToListAsync();
    }
}
