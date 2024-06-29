using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.DataInserter
{
    public class StatisticsCsvMap : ClassMap<MeetingWebsiteScraper.CLI.Statistic>
    {
        public StatisticsCsvMap()
        {
            Map(m => m.Type);
            Map(m => m.Country);
            Map(m => m.Total);
            Map(m => m.LastUpdated).TypeConverterOption.Format("yyyy-MM-dd");
        }
    }
}

