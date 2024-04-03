using RMF.DAL.Entities;
using RMF.DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IMeetingRegionRepo
    {
        Task<IEnumerable<Meeting>> Get(MeetingQuery meetingQuery);
    }
}
