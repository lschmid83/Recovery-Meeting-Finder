using RMF.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface ICountryRepo
    {
        Task<IEnumerable<Country>> GetAll();
    }
}
