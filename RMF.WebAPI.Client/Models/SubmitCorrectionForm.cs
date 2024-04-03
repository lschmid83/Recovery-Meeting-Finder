using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.WebAPI.Client.Models
{
    public class SubmitCorrectionForm
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string MeetingTitle { get; set; }
        public string MeetingAddress { get; set; }
        public string MeetingTime { get; set; }
        public string MeetingDay { get; set; }
        public string MeetingCorrectionDetails { get; set; }
    }
}
