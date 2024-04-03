using RMF.DAL.Entities;
using RMF.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IMeetingRepo
    {
        Task<IEnumerable<Meeting>> GetAll(string type);
        Task<IEnumerable<Meeting>> Get(MeetingQuery meetingQuery);
    }
}
