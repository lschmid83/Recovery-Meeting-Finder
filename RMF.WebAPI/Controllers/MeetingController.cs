using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Client.Models;
using System.Threading.Tasks;
using System;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingRepo MeetingRepo;
        private readonly IMeetingRegionRepo MeetingRegionRepo;

        public MeetingController(IMeetingRepo meetingRepo, IMeetingRegionRepo meetingRegionRepo)
        {
            MeetingRepo = meetingRepo;
            MeetingRegionRepo = meetingRegionRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "*" })]
        public async Task<Meeting> Get(int meetingId)
        {
            // Get meetings from database.
            var meeting = await MeetingRepo.Get(new DAL.Models.MeetingQuery() { meetingIds = new List<int>() { meetingId } });

            // Create AutoMapper config.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Day, Day>();
                cfg.CreateMap<DAL.Entities.Region, Region>();
                cfg.CreateMap<DAL.Entities.Type, RMF.WebAPI.Client.Models.Type>();
                cfg.CreateMap<DAL.Entities.Meeting, Meeting>();
            });
            var mapper = config.CreateMapper();

            // Map meetings to API model.
            return mapper.Map<DAL.Entities.Meeting, Meeting>(meeting.FirstOrDefault());
        }

        [HttpPost]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "*" })]
        public async Task<MeetingSearchResults> Get([FromBody]MeetingQuery meetingQuery)
        {
            // Location must be specified.
            if (meetingQuery.regionId == null && (meetingQuery.longitude == null || meetingQuery.latitude == null))
                return null;

            // Limit maximum distance to 5 miles.
            if (meetingQuery.distance == null || meetingQuery.distance > 16173.86)
                meetingQuery.distance = 16173.86;

            // Map meeting query to DAL object.
            var config = new MapperConfiguration(cfg => 
            { 
                cfg.CreateMap<MeetingQuery, DAL.Models.MeetingQuery>();
                cfg.AllowNullCollections = true;
            });
            var mapper = config.CreateMapper();
            var meetingQueryDAL = mapper.Map<MeetingQuery, DAL.Models.MeetingQuery>(meetingQuery);

            // Get meetings from database.
            IEnumerable<DAL.Entities.Meeting> meetings;
            if (meetingQuery.regionId == null)
                meetings = await MeetingRepo.Get(meetingQueryDAL);
            else
                meetings = await MeetingRegionRepo.Get(meetingQueryDAL);

            if (meetings == null)
                return null;

            return ConstructResultSet(meetingQuery, meetings);
        }

        [HttpPost]
        [Route("~/meetings-at-location")]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "*" })]
        public async Task<MeetingSearchResults> GetLocation([FromBody] MeetingQuery meetingQuery)
        {
            // Location must be specified.
            if (meetingQuery.regionId == null && (meetingQuery.longitude == null || meetingQuery.latitude == null))
                return null;

            // Map meeting query to DAL object.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MeetingQuery, DAL.Models.MeetingQuery>();
                cfg.AllowNullCollections = true;
            });
            var mapper = config.CreateMapper();
            var meetingQueryDAL = mapper.Map<MeetingQuery, DAL.Models.MeetingQuery>(meetingQuery);

            // Get meetings from database.
            IEnumerable<DAL.Entities.Meeting> meetings;
            meetings = await MeetingRepo.Get(meetingQueryDAL);

            if (meetings == null)
                return null;

            return ConstructResultSet(meetingQuery, meetings);
        }

        private MeetingSearchResults ConstructResultSet(MeetingQuery meetingQuery, IEnumerable<DAL.Entities.Meeting> meetings)
        {
            // Create AutoMapper config.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Day, Day>();
                cfg.CreateMap<DAL.Entities.Region, Region>();
                cfg.CreateMap<DAL.Entities.Type, RMF.WebAPI.Client.Models.Type>();
                cfg.CreateMap<DAL.Entities.Meeting, Meeting>();
            });
            var mapper = config.CreateMapper();

            // Map meetings to API model.
            var results = mapper.Map<IEnumerable<DAL.Entities.Meeting>, IEnumerable<Meeting>>(meetings.ToList());
            Parallel.ForEach(meetings, meeting =>
            {
                Parallel.ForEach(results, (result, state) =>
                {
                    if (meeting.Id == result.Id)
                    {
                        // Should only be null if unit testing InMemory database.
                        // Location is stored in Point which is a data type Web API cannot return
                        // so map to lat, lon variables.
                        if (meeting.Location != null)
                        {
                            result.Latitude = meeting.Location.Y;
                            result.Longitude = meeting.Location.X;
                        }

                        // Calculate distance in miles.
                        if (meetingQuery != null && meetingQuery.longitude != null && meetingQuery.latitude != null)
                        {
                            var queryLocation = new Location() { Longitude = meetingQuery.longitude.Value, Latitude = meetingQuery.latitude.Value };
                            var meetingLocation = new Location() { Longitude = meeting.Location.X, Latitude = meeting.Location.Y };
                            result.Distance = Math.Round(Location.CalculateDistance(queryLocation, meetingLocation) * 0.000621371f, 1);
                        }
                        state.Break();
                    }
                });
            });

            // Order results by distance.
            results = results.OrderBy(x => x.Distance);

            // Group results by meeting type.                        
            var meetingTypeResults = results.GroupBy(x => x.Type.ShortName, (key, value) => new MeetingSearchResult
            {
                Type = value.First().Type,
                Meetings = value.ToList()
            }).OrderBy(x => x.Type.ShortName);

            return new MeetingSearchResults()
            {
                Latitude = meetingQuery != null ? meetingQuery.latitude : 0,
                Longitude = meetingQuery != null ? meetingQuery.longitude : 0,
                MeetingTypes = meetingTypeResults.ToList(),
                StartTime = meetingQuery != null ? meetingQuery.startTime : DateTime.Now
            };
        }

        /*
        [HttpGet]
        [Route("all")]
        [Authorization(UserType = UserType.ApiUser)]
        public async Task<MeetingSearchResults> GetAll(string type, string auth)
        {
            if (auth != "x4srEp9QFrKt")
                return null;

            var meetings = await MeetingRepo.GetAll(type); 

            if (meetings == null)
                return null;

            return ConstructResultSet(null, meetings);
        }*/

        public class Location
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public static double CalculateDistance(Location point1, Location point2)
            {
                var d1 = point1.Latitude * (Math.PI / 180.0);
                var num1 = point1.Longitude * (Math.PI / 180.0);
                var d2 = point2.Latitude * (Math.PI / 180.0);
                var num2 = point2.Longitude * (Math.PI / 180.0) - num1;
                var d3 = Math.Pow(Math.Sin((d2 - d1) / 2.0), 2.0) +
                         Math.Cos(d1) * Math.Cos(d2) * Math.Pow(Math.Sin(num2 / 2.0), 2.0);
                return 6376500.0 * (2.0 * Math.Atan2(Math.Sqrt(d3), Math.Sqrt(1.0 - d3)));
            }
        }
    }
}



