using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DataInserter
{
    public class RegionInformationCsv
    {
        public string Name { get; set; }

        public string Area { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int Zoom { get; set; }
    }
}
