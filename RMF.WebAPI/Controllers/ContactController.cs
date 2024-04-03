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
    public class ContactController : ControllerBase
    {
        private readonly SmtpSupportSettings SmtpSettings;

        public ContactController(SmtpSupportSettings smtpSettings)
        {
            this.SmtpSettings = smtpSettings;
        }

        [HttpPost]
        [Route("~/contact/send")]
        [ResponseCache(Duration = 3600)]
        public async Task<IActionResult> Post([FromBody] ContactForm contactForm)
        {
            if (String.IsNullOrEmpty(contactForm.Email))
                return BadRequest();

            var mail = new MailMessage()
            {
                From = new MailAddress(SmtpSettings.Address),
                IsBodyHtml = true,
                BodyEncoding = System.Text.Encoding.UTF8
            };
            mail.To.Add(SmtpSettings.Address);
            mail.Subject = "Contact Form";
            mail.Body = "Name: " + contactForm.Name + "<br/><br/>" +
                        "Email: " + contactForm.Email + "<br/><br/>" +
                        "Message: <br/><br/>" + contactForm.Message;

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
            mail.To.Add(contactForm.Email);
            mail.Subject = "Recovery Meeting Finder Automated Reply";
            mail.Body = "Recovery Meeting Finder - Contact Us<br/><br/>" +
                        "Thank you for contacting recoverymeetingfinder.com. " +
                        "We are happy to look into your support request and will aim to reply within 48 hours.<br/><br/>" +
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