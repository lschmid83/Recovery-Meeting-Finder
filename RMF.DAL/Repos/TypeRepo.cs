using Microsoft.EntityFrameworkCore;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.DAL.Repos
{
    public class TypeRepo : MeetingContext, ITypeRepo
    {
        public TypeRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public TypeRepo()
        {
        }

        public async Task<IEnumerable<Type>> GetAll() =>
            await Type.OrderBy(x => x.Order).ToListAsync();
    }
}
