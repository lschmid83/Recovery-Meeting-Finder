using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.WebAPI.Models
{
    public class MeetingSearchResult
    {
        public Type Type { get; set; }

        public List<Meeting> Meetings { get; set; }
    }
}
