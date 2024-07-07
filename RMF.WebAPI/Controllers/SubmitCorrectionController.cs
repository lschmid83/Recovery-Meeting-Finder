using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Client.Models;
using RMF.WebAPI.SMTP;

namespace RMF.WebAPI.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class SubmitCorrectionController : ControllerBase
    {
        private readonly SmtpCorrectionsSettings SmtpSettings;
        private readonly IDayRepo DayRepo;

        public SubmitCorrectionController(SmtpCorrectionsSettings smtpSettings, IDayRepo dayRepo)
        {
            SmtpSettings = smtpSettings;
            DayRepo = dayRepo;
        }

        [HttpPost]
        [Route("~/submit-correction/send")]
        [ResponseCache(Duration = 3600)]
        public async Task<IActionResult> Post([FromBody] SubmitCorrectionForm submitCorrectionForm)
        {

            if (String.IsNullOrEmpty(submitCorrectionForm.Email))
                return BadRequest();

            var mail = new MailMessage()
            {
                From = new MailAddress(SmtpSettings.Address),
                IsBodyHtml = true,
                BodyEncoding = System.Text.Encoding.UTF8
            };
            mail.To.Add(SmtpSettings.Address);
            mail.Subject = "Meeting Correction";
            mail.Body = "Name: " + submitCorrectionForm.Name + "<br/><br/>" +
                        "Email: " + submitCorrectionForm.Email + "<br/><br/>" +
                        "Telephone: " + submitCorrectionForm.Telephone + "<br/><br/><br/>" +
                        "Meeting Title:" + "<br/><br/>" + submitCorrectionForm.MeetingTitle + "<br/><br/>" +
                        "Meeting Address:" + "<br/><br/>" + submitCorrectionForm.MeetingAddress + "<br/><br/>" +
                        "Meeting Time:" + "<br/><br/>" + submitCorrectionForm.MeetingAddress + "<br/><br/>" +
                        "Meeting Day:" + "<br/><br/>" + submitCorrectionForm.MeetingDay + "<br/><br/>" +
                        "Meeting Correction Details:" + "<br/><br/>" + submitCorrectionForm.MeetingCorrectionDetails;

            var client = new SmtpClient(SmtpSettings.Host, SmtpSettings.Port)
            {
                Credentials = new System.Net.NetworkCredential(SmtpSettings.Address, SmtpSettings.Password),
                EnableSsl = true
            };

            try
            {
                await client.SendMailAsync(mail);
            }
            catch
            {
                return BadRequest();
            }

            mail = new MailMessage()
            {
                From = new MailAddress(SmtpSettings.Address),
                IsBodyHtml = true,
                BodyEncoding = System.Text.Encoding.UTF8
            };
            mail.To.Add(submitCorrectionForm.Email);
            mail.Subject = "Recovery Meeting Finder Automated Reply";
            mail.Body = "Recovery Meeting Finder - Submit a Correction<br/><br/>" +
                        "Thank you for submitting your meeting data correction request. " +
                        "We will try and update our database accordingly in the next data import. " +
                        "You may have to wait up to a month for the update to appear on the website search results.<br/><br/>" +
                        "Thank you,<br/><br/>" +
                        "RMF Team";

            client = new SmtpClient(SmtpSettings.Host, SmtpSettings.Port)
            {
                Credentials = new System.Net.NetworkCredential(SmtpSettings.Address, SmtpSettings.Password),
                EnableSsl = true
            };

            try
            {
                await client.SendMailAsync(mail);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}

