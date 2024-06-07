using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.WebAPI.Client.Models
{
    public class DataDumpResults
    {
        public string Path { get; set; }
        public string Statistics { get; set; }
        public string Regions { get; set; }
        public List<DataDumpResult> DataDumps { get; set; } = new List<DataDumpResult>();
    }
}
