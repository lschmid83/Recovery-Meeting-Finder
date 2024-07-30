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
    public class UserRepo : MeetingContext, IUserRepo
    {
        public UserRepo(DbContextOptions<MeetingContext> options) : base(options)
        {
        }

        public UserRepo()
        {
        }

        public async Task<User> Get(string username) =>
            await User.Where(x => x.Username == username).FirstOrDefaultAsync();
    }
}
