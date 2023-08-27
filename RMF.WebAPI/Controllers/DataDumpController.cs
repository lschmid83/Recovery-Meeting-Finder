using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Entities;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DataDumpController : ControllerBase
    {
        private readonly IDataDumpRepo DataDumpRepo;

        public DataDumpController(IDataDumpRepo dataDumpRepo)
        {
            DataDumpRepo = dataDumpRepo;
        }

        [HttpGet]
        [Route("~/data-dump")]
        [ResponseCache(Duration = 3600)]
        public async Task<DataDumpResults> Get()
        {
            var dataDumps = await DataDumpRepo.GetAll();

            var dataDumpResults = new DataDumpResults
            {
                Path = "/data-dump/",
                Statistics = "statistics.csv"
            };

            foreach (var dataDump in dataDumps)
            {
                var dataDumpDate = dataDump.Date.ToString("yyyy-MM-dd");
                dataDumpResults.DataDumps.Add(new DataDumpResult()
                {
                    Date = dataDumpDate,
                    Filenames = new List<string>()
                    {
                        "meetings-" + dataDumpDate + ".csv",
                        "regions-" + dataDumpDate + ".csv",
                        "statistics-" + dataDumpDate + ".csv"
                    } 
                });
            }
            return dataDumpResults;
        }
    }
}
