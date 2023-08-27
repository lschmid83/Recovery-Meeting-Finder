using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Models;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly SmtpSettings SmtpSettings;

        public ContactController(SmtpSettings smtpSettings)
        {
            this.SmtpSettings = smtpSettings;
        }

        [HttpPost]
        [Route("~/contact/send")]
        [ResponseCache(Duration = 3600)]
        public async Task<IActionResult> Post([FromBody] ContactForm contactForm)
        {
            if (string.IsNullOrEmpty(contactForm.Email))
                return BadRequest();

            var mail = new MailMessage()
            {
                From = new MailAddress(SmtpSettings.Address)
            };
            mail.To.Add(SmtpSettings.Address);
            mail.Subject = "Contact Form";
            mail.Body = "Name: " + contactForm.Name + Environment.NewLine + Environment.NewLine +
                        "Email: " + contactForm.Email + Environment.NewLine + Environment.NewLine +
                        "Message: " + Environment.NewLine + Environment.NewLine + contactForm.Message;

            var client = new SmtpClient(SmtpSettings.Host, SmtpSettings.Port)
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
