﻿using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.ActionFilters;
using RMF.WebAPI.Client.Models;
using RMF.WebAuth.Enums;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DayController : ControllerBase
    {
        private readonly IDayRepo DayRepo;

        public DayController(IDayRepo dayRepo)
        {
            DayRepo = dayRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600)]
        [Authorization(UserType = UserType.ApiUser)]
        public async Task<IEnumerable<Day>> Get()
        {
            var days = await DayRepo.GetAll();
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Day, Day>();
            });
            var mapper = config.CreateMapper();
            return mapper.Map<IEnumerable<DAL.Entities.Day>, IEnumerable<Day>>(days);
        }
    }
}

