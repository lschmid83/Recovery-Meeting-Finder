using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.WebAPI.Client.Models;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticRepo StatisticRepo;

        public StatisticController(IStatisticRepo dayRepo)
        {
            StatisticRepo = dayRepo;
        }

        [HttpGet]
        [Route("latest/meeting-type")]
        [ResponseCache(Duration = 3600)]
        public async Task<StatisticTypeResults> GetLatestStatisticType()
        { 
            // Get latest statistics.
            var statistics = await StatisticRepo.GetLatest();

            // Return result set.
            return ConstructStatisticTypeResults(statistics);
        }

        [HttpGet]
        [Route("history/meeting-type")]
        [ResponseCache(Duration = 3600)]
        public async Task<IEnumerable<StatisticTypeResults>> GetHistoryStatisticType()
        {
            // Get latest statistics.
            var statistics = await StatisticRepo.GetAll();

            // Group latest statistics by meeting type. 
            var meetingStatisticHistoryGroups = statistics.GroupBy(x => new { x.LastUpdated.Day, x.LastUpdated.Month, x.LastUpdated.Year });

            // Construct result set.
            var results = new List<StatisticTypeResults>();
            foreach (var meetingStatisticHistoryGroup in meetingStatisticHistoryGroups)
                results.Add(ConstructStatisticTypeResults(meetingStatisticHistoryGroup));

            // Return result set.
            return results;
        }

        private StatisticTypeResults ConstructStatisticTypeResults(IEnumerable<DAL.Entities.Statistic> statisticsDbResults)
        {
            // Group latest statistics by meeting type. 
            var meetingStatisticTypeGroups = statisticsDbResults.OrderBy(x => x.Type.Order).GroupBy(x => x.Type.ShortName, (key, value) => new
            {
                Type = value.First().Type,
                Total = value.Sum(x => x.Total)
            });

            // Create result set.
            var results = new StatisticTypeResults();
            results.MeetingTypes = new List<StatisticTypeResult>();
            foreach (var meetingStatisticTypeGroup in meetingStatisticTypeGroups)
            {
                results.MeetingTypes.Add(new StatisticTypeResult()
                {
                    Type = meetingStatisticTypeGroup.Type.ShortName,
                    Total = meetingStatisticTypeGroup.Total
                });
                results.Total += meetingStatisticTypeGroup.Total;
            }
            results.LastUpdated = statisticsDbResults.FirstOrDefault().LastUpdated;

            return results;
        }

        [HttpGet]
        [Route("latest/country")]
        [ResponseCache(Duration = 3600)]
        public async Task<StatisticCountryResults> GetLatestStatisticCountry()
        {
            // Get latest statistics.
            var statistics = await StatisticRepo.GetLatest();
            
            // Return result set.
            return ConstructStatisticCountryResults(statistics);
        }


        [HttpGet]
        [Route("history/country")]
        [ResponseCache(Duration = 3600)]
        public async Task<IEnumerable<StatisticCountryResults>> GetHistoryStatisticCountry()
        {
            // Get latest statistics.
            var statistics = await StatisticRepo.GetAll();

            // Group latest statistics by meeting type. 
            var meetingStatisticHistoryGroups = statistics.GroupBy(x => new { x.LastUpdated.Day, x.LastUpdated.Month, x.LastUpdated.Year });

            // Construct result set.
            var results = new List<StatisticCountryResults>();
            foreach (var meetingStatisticHistoryGroup in meetingStatisticHistoryGroups)
                results.Add(ConstructStatisticCountryResults(meetingStatisticHistoryGroup));

            // Return result set.
            return results;
        }

        private StatisticCountryResults ConstructStatisticCountryResults(IEnumerable<DAL.Entities.Statistic> statisticsDbResults)
        {
            // Group latest statistics by country. 
            var meetingStatisticCountryGroups = statisticsDbResults.OrderBy(x => x.Country.Order).GroupBy(x => x.Country.Name, (key, value) => new
            {
                Country = value.First().Country,
                Statistics = value,
                Total = value.Sum(x => x.Total)
            });

            // Create result set.
            var results = new StatisticCountryResults();
            results.MeetingCountries = new List<StatisticCountryResult>();
            var total = 0;
            foreach (var meetingStatisticCountryGroup in meetingStatisticCountryGroups)
            {
                // Construct country result sets.
                var statisticCountryResult = new StatisticCountryResult
                {
                    Country = meetingStatisticCountryGroup.Country.Name,
                    MeetingTypes = new List<StatisticTypeResult>(),
                    Total = meetingStatisticCountryGroup.Total
                };

                // Construct meeting type totals.
                foreach (var statistic in meetingStatisticCountryGroup.Statistics)
                {
                    statisticCountryResult.MeetingTypes.Add(new StatisticTypeResult()
                    {
                        Type = statistic.Type.ShortName,
                        Total = statistic.Total
                    });
                }
                results.MeetingCountries.Add(statisticCountryResult);

                // Add to final total.
                total += meetingStatisticCountryGroup.Total;
            }
            results.Total = total;
            results.LastUpdated = statisticsDbResults.FirstOrDefault().LastUpdated;

            return results;
        }
    }
}
