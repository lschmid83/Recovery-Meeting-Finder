using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Client.Models;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeetingFormatController : ControllerBase
    {
        private readonly IMeetingFormatRepo meetingFormatRepo;

        public MeetingFormatController(IMeetingFormatRepo meetingFormatRepo)
        {
            this.meetingFormatRepo = meetingFormatRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600)]
        public async Task<IEnumerable<MeetingFormat>> Get([FromBody]IEnumerable<int> formatIds)
        {
            var meetingFormats = await meetingFormatRepo.Get(formatIds);
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.MeetingFormat, MeetingFormat>();
            });
            var mapper = config.CreateMapper();
            return mapper.Map<IEnumerable<DAL.Entities.MeetingFormat>, IEnumerable<MeetingFormat>>(meetingFormats);

        }
    }
}

