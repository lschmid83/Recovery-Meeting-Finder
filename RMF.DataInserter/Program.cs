using AutoMapper;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using NetTopologySuite.Algorithm;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Prepared;
using RMF.DAL;
using RMF.DAL.Entities;
using RMF.DAL.Entities.Interfaces;
using RMF.DAL.Repos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace RMF.DataInserter
{
    class Program
    {
        private const string DataDumpPath = @"$installPath\DataDump\";
        private const string WebDataDumpPath = @"$installPath\RMF.Website\wwwroot\data-dump\";
        private static string UseDateDumpDate = null;
        private static string LatestDataDumpDate = null;
        private static string LastMonthDataDumpDate = null;
        private const string DbBackupFilePath = @"$installPath\DataDump\rmf.bak";
        private static MeetingContext dbContext = new MeetingContext();
        private static readonly string[] UseOrganisations = new string[] { "AA", "CA", "NA", "OA" };

        static void Main()
        {
            // Create database.
            dbContext.Database.EnsureDeleted();
            dbContext.Database.Migrate();

            // Delete database backup.
            if (File.Exists(DbBackupFilePath))
                File.Delete(DbBackupFilePath);

            // Create tables.
            CreatePageIndexTable();

            CreateMeetingDataDumpTables();

            CreateTypeTable();
            CreateCountryTable();
            CreateAreaTable();
            CreateRegionTable();
            CreateDayTable();
            CreateFormatTable();
            CreateMeetingTables();
            CreateMeetingRegionTables();
            CreateMeetingFormatTable();
            CreateStatisticTable();
            CreateDataDumpTable();

            CreateWebDataDump();

            // Backup.
            BackupDatabase();

            Console.WriteLine("Done");
            Console.ReadLine();
        }

        private static void CreatePageIndexTable()
        {
            var exePath = System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            var pageIndexes = new List<PageIndex>();

            var pageIndex = new PageIndex()
            {
                Path = "index",
                Title = File.ReadAllText(exePath + @"\PageIndex\index-title.txt"),
                Content = File.ReadAllText(exePath + @"\PageIndex\index.txt")
            };
            pageIndexes.Add(pageIndex);

            var pageIndexDirectory = Directory.GetDirectories(exePath + @"\PageIndex\");
            foreach(var directory in pageIndexDirectory)
            {
                var files = Directory.GetFiles(directory);
                foreach(var file in files)
                {
                    if (file.Contains("-title.txt"))
                        continue;

                    pageIndex = new PageIndex()
                    {
                        Path = Path.GetFileName(directory) + @"/" + Path.GetFileNameWithoutExtension(file),
                        Title = File.ReadAllText(file.Replace(".txt", "-title.txt")),
                        Content = File.ReadAllText(file)
                    };
                    pageIndexes.Add(pageIndex);
                }
            }
            dbContext.PageIndex.AddRange(pageIndexes);
            dbContext.SaveChanges();
        }

        private static List<DateTime> GetDataDumpFolderDates()
        {
            // Get latest import directory.
            var dirs = Directory.GetDirectories(DataDumpPath, "*", SearchOption.TopDirectoryOnly);
            List<DateTime> folderNames = new List<DateTime>();
            foreach (string dir in dirs)
            {
                try { folderNames.Add(DateTime.ParseExact(new DirectoryInfo(dir).Name, "yyyy-MM-dd", null)); }
                catch (Exception) { }
            }
            return folderNames;
        }

        private static void CreateMeetingDataDumpTables()
        {
            var dataDumpFolderDates = GetDataDumpFolderDates();

            // Set data dump date or use maxiumum.
            if (UseDateDumpDate == null)
                LatestDataDumpDate = dataDumpFolderDates.Max(x => x.Date).ToString("yyyy-MM-dd");
            else
                LatestDataDumpDate = dataDumpFolderDates.Where(x => x.Date.ToString("yyyy-MM-dd") == UseDateDumpDate).FirstOrDefault().ToString("yyyy-MM-dd");
    
            var latestDataDumpDateIndex = dataDumpFolderDates.ToList().IndexOf(DateTime.Parse(LatestDataDumpDate));
            if (latestDataDumpDateIndex > 0)
                LastMonthDataDumpDate = dataDumpFolderDates[latestDataDumpDateIndex - 1].ToString("yyyy-MM-dd");

            Console.WriteLine("Insert MeetingDataDump");
            var meetingsCsvPath = DataDumpPath + LatestDataDumpDate + @"\meetings-" + LatestDataDumpDate + ".csv";
            CreateMeetingDataDumpTable<MeetingDataDump>(dbContext.MeetingDataDump, meetingsCsvPath);

            if (LastMonthDataDumpDate != null)
            {
                Console.WriteLine("Insert PreviousMeetingDataDump");
                meetingsCsvPath = DataDumpPath + LastMonthDataDumpDate + @"\meetings-" + LastMonthDataDumpDate + ".csv";
                CreateMeetingDataDumpTable<PreviousMeetingDataDump>(dbContext.PreviousMeetingDataDump, meetingsCsvPath);
            }
        }

        private static void CreateMeetingDataDumpTable<TMeetingDataDumpTable>(DbSet<TMeetingDataDumpTable> meetingDataDumpTable, string meetingsCsvPath) where TMeetingDataDumpTable: class, IMeetingDataDump
        {
            // Read meetings.csv generated by RMF.MeetingWebsiteScraper.CLI.
            var meetingDataDump = new List<TMeetingDataDumpTable>();
            using (var reader = new StreamReader(meetingsCsvPath, Encoding.UTF8))
            {
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    // Read all CSV records.
                    var records = csv.GetRecords<Meeting>().ToList();

                    // Check field lengths.
                    if (!CheckFieldLengths(records))
                    {
                        Console.WriteLine("Meeting data field violates database column length constraint");
                        Console.WriteLine("Aborted insert");
                        Console.ReadLine();
                        Environment.Exit(0);
                    }

                    // Create AutoMapper configuration. Ignore missing fields.
                    var config = new MapperConfiguration(cfg =>
                    {
                        cfg.CreateMap<Meeting, TMeetingDataDumpTable>();
                    });
                    var mapper = config.CreateMapper();
                    meetingDataDump = mapper.Map<List<Meeting>, List<TMeetingDataDumpTable>>(records);
                    for (var i = 0; i < meetingDataDump.Count; i++)
                    {
                        meetingDataDump[i].Day = WebUtility.HtmlDecode(meetingDataDump[i].Day.Trim());
                    }
                }

                // Insert into table.
                meetingDataDumpTable.AddRange(meetingDataDump);
                dbContext.SaveChanges();
            }
        }

        private static void CreateTypeTable()
        {
            Console.WriteLine("Insert Type");

            // Read organisations.json.
            var organisationReader = new OrganisationReader();
            var organisations = organisationReader.Read(AppDomain.CurrentDomain.BaseDirectory + "organisations.json");

            // Add types.
            var types = new List<DAL.Entities.Type>();
            var order = 0;
            foreach (var organisation in organisations)
            {
                // Skip organisation.
                if (!UseOrganisations.Contains(organisation.Namespace))
                    continue;

                var type = new DAL.Entities.Type()
                {
                    Name = organisation.Name,
                    Namespace = organisation.Namespace,
                    ShortName = organisation.ShortName,
                    Color = organisation.Color,
                    Order = order
                };
                types.Add(type);
                order++;
            }

            // Insert into Type table.
            dbContext.Type.AddRange(types.OrderBy(x=> x.Order));
            dbContext.SaveChanges();
        }

        private static void CreateCountryTable()
        {
            Console.WriteLine("Insert Country");

            var countries = new List<Country>()
            {
                new Country() { Name = "England", Order = 0 },
                new Country() { Name = "Scotland", Order = 1 },
                new Country() { Name = "Wales", Order = 2 },
                new Country() { Name = "Northern Ireland", Order = 3 },
                new Country() { Name = "Republic of Ireland", Order = 4 },
            };

            dbContext.Country.AddRange(countries.OrderBy(x => x.Order));
            dbContext.SaveChanges();
        }

        private static void CreateAreaTable()
        {
            Console.WriteLine("Insert Area");

            // Select AA region areas.
            var areas = dbContext.MeetingDataDump
                .Where(x => x.MeetingTypeNamespace == "AA" && x.RegionArea != "UK" && !String.IsNullOrEmpty(x.RegionArea)) // UK is used as a placeholder for regions we don't want to add (Some region areas can be blank.
                .OrderBy(x => x.RegionAreaOrder)
                .DistinctBy(x=> x.RegionArea)
                .Select(x => new DAL.Entities.Area
                {
                    Name = x.RegionArea.Trim(),
                    Order = x.RegionAreaOrder
                });
            
            // Insert into Area table.
            dbContext.Area.AddRange(areas.OrderBy(x=> x.Order));
            dbContext.SaveChanges();
        }

        private static void CreateRegionTable()
        {
            Console.WriteLine("Insert Region");

            // Read region lat, lon and zoom from CSV file.
            var regionInfoCsv = new List<RegionInformationCsv>();
            var regionsCsvPath = DataDumpPath + LatestDataDumpDate + @"\regions-" + LatestDataDumpDate + ".csv";
            using (var reader = new StreamReader(regionsCsvPath, Encoding.UTF8))
            {
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    regionInfoCsv = csv.GetRecords<RegionInformationCsv>().ToList();
                }
            }

            // Get meeting regions grouped by name.
            var regionGroups = dbContext.MeetingDataDump
                .Where(x => x.MeetingTypeNamespace == "AA" && !String.IsNullOrEmpty(x.Region) && x.RegionArea != "UK" && !String.IsNullOrEmpty(x.RegionArea))
                .GroupBy(x => new { x.Region, x.RegionArea })
                .Select(x => new { x.Key.Region, x.Key.RegionArea });

            // Loop through regions.
            var regions = new List<Region>();
            foreach (var region in regionGroups)
            {
                // Select all lat and lon values for meetings in region.
                // Only select AA meetings which have a region. (This is the 'good data' we use to create convex hull).
                var meetings = dbContext.MeetingDataDump
                    .Where(x => x.MeetingTypeNamespace == "AA" && x.Region == region.Region)
                    .Select(x => new { x.Region, x.RegionArea, x.Latitude, x.Longitude });

                var country = dbContext.MeetingDataDump
                    .Where(x => x.MeetingTypeNamespace == "AA" && x.Region == region.Region)
                    .Select(x => x.Country)
                    .FirstOrDefault();

                // Create geomotery for points.
                var geometeryFactory = new GeometryFactory(new PrecisionModel(), 4326);

                // Loop through lat, lon and construct coordinates.
                var pointList = new List<Geometry>();
                double averageLon = 0, averageLat = 0;
                foreach (var meeting in meetings)
                {
                    averageLon += meeting.Longitude;
                    averageLat += meeting.Latitude;

                    var coordinate = new Point(meeting.Longitude, meeting.Latitude) { SRID = 4326 };
                    pointList.Add(coordinate);
                }

                // Calculate avergae lon, lat
                averageLon /= meetings.Count();
                averageLat /= meetings.Count();

                // Create a convex hull from points.
                var convexHull = new ConvexHull(geometeryFactory.BuildGeometry(pointList.ToArray()));

                // Create a boundary array.
                var boundary = "[[";
                foreach (var coordinate in convexHull.GetConvexHull().Coordinates)
                {
                    boundary += "[" + coordinate.X.ToString().Replace(',', '.') + "," + coordinate.Y.ToString().Replace(',', '.') + "],";
                }
                boundary = boundary.TrimEnd(',');
                boundary += "]]";

                // Get region latitude and longitude and map zoom level.
                var regionInfo = regionInfoCsv.Where(x => x.Name == region.Region).FirstOrDefault();
                if (regionInfo == null)
                    Console.WriteLine("Missing region information using default values: " + region.Region);

                // Add region to database.
                regions.Add(new Region()
                {
                    Name = region.Region,
                    Location = regionInfo != null ? new Point(regionInfo.Longitude, regionInfo.Latitude) { SRID = 4326 } : new Point(averageLon, averageLat) { SRID = 4326 },
                    Zoom = regionInfo != null ? regionInfo.Zoom : 0,
                    AreaId = dbContext.Area.Where(x => x.Name == region.RegionArea).FirstOrDefault().Id,
                    CountryId = dbContext.Country.Where(x => x.Name == country).FirstOrDefault().Id,
                    ConvexHull = convexHull.GetConvexHull(),
                    Boundary = boundary
                });
            }

            // Insert into Region table.
            dbContext.Region.AddRange(regions);
            dbContext.SaveChanges();

            // Write regions information with any missing regions left blank.
            var areas = new AreaRepo().GetAll().Result;
            var regionInformationOutput = new List<RegionInformationCsv>();

            foreach (var area in areas)
            {
                foreach (var region in area.Regions.OrderBy(x => x.Name))
                {
                    var regionInfo = regionInfoCsv.Where(x => x.Name == region.Name).FirstOrDefault();
                    regionInformationOutput.Add(new RegionInformationCsv()
                    {
                        Name = region.Name,
                        Latitude = regionInfo != null ? regionInfo.Latitude : 0,
                        Longitude = regionInfo != null ? regionInfo.Longitude : 0,
                        Zoom = regionInfo != null ? regionInfo.Zoom : 0,
                        Area = area.Name
                    });
                }
            }

            // Write CSV file.
            var csvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture);
            if (File.Exists(regionsCsvPath))
                File.Delete(regionsCsvPath);

            // Overwrite current data dump regions CSV.
            using (FileStream fs = new FileStream(regionsCsvPath, FileMode.Create, FileAccess.Write))
            {
                using (var sw = new StreamWriter(fs, Encoding.UTF8))
                {
                    // Write regionss to CSV.
                    using (var csv = new CsvWriter(sw, csvConfiguration))
                        csv.WriteRecords(regionInformationOutput);
                }
            }

            // Create base regions file.
            using (FileStream fs = new FileStream(DataDumpPath + "regions.csv", FileMode.Create, FileAccess.Write))
            {
                using (var sw = new StreamWriter(fs, Encoding.UTF8))
                {
                    // Write regionss to CSV.
                    using (var csv = new CsvWriter(sw, csvConfiguration))
                        csv.WriteRecords(regionInformationOutput);
                }
            }
        }

        private static void CreateDayTable()
        {
            Console.WriteLine("Insert Day");

            var days = new List<Day>()
            {
                new Day() { Name = "Monday", Order = 0 },
                new Day() { Name = "Tuesday", Order = 1 },
                new Day() { Name = "Wednesday", Order = 2 },
                new Day() { Name = "Thursday", Order = 3 },
                new Day() { Name = "Friday", Order = 4 },
                new Day() { Name = "Saturday", Order = 5 },
                new Day() { Name = "Sunday", Order = 6 }
            };

            dbContext.Day.AddRange(days.OrderBy(x=> x.Order));
            dbContext.SaveChanges();
        }

        private static void CreateFormatTable()
        {
            Console.WriteLine("Insert Format");

            var formats = new List<Format>();
            var types = dbContext.Type.ToList();
            foreach (var meetingData in dbContext.MeetingDataDump)
            {
                // Select format separated values.
                foreach (var format in meetingData.Format.Split(','))
                {
                    if (string.IsNullOrEmpty(format)) 
                        continue;

                    // Add format to result set.
                    formats.Add(new Format()
                    {
                        Name = format.Trim(),
                        TypeId = types.Where(x => x.Namespace == meetingData.MeetingTypeNamespace.ToUpper()).FirstOrDefault().Id
                    });
                }
            };

            // Insert into Format table.
            dbContext.Format.AddRange(formats.DistinctBy(x => new { x.Name, x.TypeId }));
            dbContext.SaveChanges();
        }

        private static void CreateMeetingTables()
        {
            Console.WriteLine("Insert Meeting");
            CreateMeetingTable(dbContext.MeetingDataDump, dbContext.Meeting);                  
            Console.WriteLine("Insert PreviousMeeting");
            CreateMeetingTable(dbContext.PreviousMeetingDataDump, dbContext.PreviousMeeting);
            CreateMeetingAddedTable();
            CreateMeetingRemovedTable();
        }

        private static void CreateMeetingTable<TMeetingDataDumpTable, TMeetingTable>(DbSet<TMeetingDataDumpTable> meetingDataDumpTable, DbSet<TMeetingTable> meetingTable) where TMeetingDataDumpTable : class, IMeetingDataDump where TMeetingTable : class, IMeeting
        {
            var meetings = new List<RMF.DAL.Entities.Meeting>();

            var days = dbContext.Day;
            var regions = dbContext.Region;
            var types = dbContext.Type;
            var countries = dbContext.Country;

            foreach (var meetingData in meetingDataDumpTable)
            {          
                // Variables used to create hash string for bookmark.
                var time = DateTime.Parse(meetingData.Time);
                var postcode = meetingData.Postcode;
                var dayId = days.Where(x => x.Name == meetingData.Day).FirstOrDefault().Id;

                // Add meeting to result set.
                meetings.Add(new RMF.DAL.Entities.Meeting()
                {
                    Guid = meetingData.Guid,
                    Title = !string.IsNullOrEmpty(meetingData.Title) ? meetingData.Title : null,
                    Time = time,
                    Duration = !string.IsNullOrEmpty(meetingData.Duration) ? meetingData.Duration : null,
                    Postcode = !string.IsNullOrEmpty(meetingData.Postcode) ? postcode : null,
                    Location = new Point(meetingData.Longitude, meetingData.Latitude) { SRID = 4326 },
                    Venue = !string.IsNullOrEmpty(meetingData.Venue) ? meetingData.Venue : null,
                    Address = meetingData.Address,
                    What3Words = meetingData.What3Words,
                    DayId = dayId,
                    Hearing = meetingData.Hearing,
                    Wheelchair = meetingData.Wheelchair,
                    Chit = meetingData.Chit,
                    Open = meetingData.Open,
                    OpenFormat = !string.IsNullOrEmpty(meetingData.OpenFormat) ? meetingData.OpenFormat : null,
                    Format = !string.IsNullOrEmpty(meetingData.Format) ? meetingData.Format : null,
                    Note = !string.IsNullOrEmpty(meetingData.Note) ? meetingData.Note : null,
                    Code = !string.IsNullOrEmpty(meetingData.Code) ? meetingData.Code : null,
                    TypeId = types.Where(x => x.Namespace == meetingData.MeetingTypeNamespace).FirstOrDefault().Id,
                    RegionArea = meetingData.RegionArea,
                    RegionName = meetingData.Region,
                    Country = meetingData.Country,
                    Hash = GetDeterministicHashCode(time.ToString() + postcode + dayId.ToString())
                });
            }

            // Create AutoMapper configuration. Ignore missing fields.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Meeting, TMeetingTable>();
            });
            var mapper = config.CreateMapper();
            var meetingsForTable = mapper.Map<List<RMF.DAL.Entities.Meeting>, List<TMeetingTable>>(meetings);

            meetingTable.AddRange(meetingsForTable);
            dbContext.SaveChanges();
        }

        private static void CreateMeetingAddedTable()
        {
            Console.WriteLine("Insert MeetingAdded");

            // Get meetings which were not in last months import.
            var meetingsAdded = dbContext.Meeting.Where(c => !dbContext.PreviousMeeting.Select(b => b.Guid).Contains(c.Guid)).AsNoTracking().ToList();

            // Create AutoMapper configuration. Ignore missing fields.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Meeting, MeetingAdded>();
            });
            var mapper = config.CreateMapper();
            
            // Convert meeting type.
            var meetingsForTable = mapper.Map<List<RMF.DAL.Entities.Meeting>, List<MeetingAdded>>(meetingsAdded);

            // Add meetings to table.
            dbContext.Database.OpenConnection();
            try
            {
                dbContext.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.MeetingAdded ON");
                dbContext.MeetingAdded.AddRange(meetingsForTable);
                dbContext.SaveChanges();
                dbContext.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.MeetingAdded OFF");
            }
            finally
            {
                dbContext.Database.CloseConnection();
            }
        }

        private static void CreateMeetingRemovedTable()
        {
            Console.WriteLine("Insert MeetingRemoved");

            // Get meetings which were not in last months import.
            var meetingsRemoved = dbContext.PreviousMeeting.Where(c => !dbContext.Meeting.Select(b => b.Guid).Contains(c.Guid)).ToList();

            // Create AutoMapper configuration. Ignore missing fields.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<PreviousMeeting, MeetingRemoved>();
            });
            var mapper = config.CreateMapper();

            // Convert meeting type.
            var meetingsForTable = mapper.Map<List<PreviousMeeting>, List<MeetingRemoved>>(meetingsRemoved);

            // Add meetings to table.
            dbContext.Database.OpenConnection();
            try
            {
                dbContext.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.MeetingRemoved ON");
                dbContext.MeetingRemoved.AddRange(meetingsForTable);
                dbContext.SaveChanges();
                dbContext.Database.ExecuteSqlRaw("SET IDENTITY_INSERT dbo.MeetingRemoved OFF");
            }
            finally
            {
                dbContext.Database.CloseConnection();
            }
        }

        private static int GetDeterministicHashCode(string str)
        {
            unchecked
            {
                int hash1 = (5381 << 16) + 5381;
                int hash2 = hash1;

                for (int i = 0; i < str.Length; i += 2)
                {
                    hash1 = ((hash1 << 5) + hash1) ^ str[i];
                    if (i == str.Length - 1)
                        break;
                    hash2 = ((hash2 << 5) + hash2) ^ str[i + 1];
                }

                return hash1 + (hash2 * 1566083941);
            }
        }

        private static void CreateMeetingRegionTables()
        {
            Console.WriteLine("Insert MeetingRegion");
            CreateMeetingRegionTable(dbContext.Meeting, dbContext.MeetingRegion);
            Console.WriteLine("Insert MeetingAddedRegion");
            CreateMeetingRegionTable(dbContext.MeetingAdded, dbContext.MeetingAddedRegion);
            Console.WriteLine("Insert MeetingRemovedRegion");
            // Drop MeetingRemovedRegion Meeting FK Constraint as they will not exist in Meeting table.
            dbContext.Database.OpenConnection();
            try
            {
                dbContext.Database.ExecuteSqlRaw("ALTER TABLE dbo.MeetingRemovedRegion NOCHECK CONSTRAINT FK_MeetingRemovedRegion_Meeting_MeetingId");
                dbContext.SaveChanges();
            }
            finally
            {
                dbContext.Database.CloseConnection();
            }
            CreateMeetingRegionTable(dbContext.MeetingRemoved, dbContext.MeetingRemovedRegion);
        }

        private static void CreateMeetingRegionTable<TMeetingTable, TMeetingRegionTable>(DbSet<TMeetingTable> meetingTable, DbSet<TMeetingRegionTable> meetingRegionTable) where TMeetingTable : class, IMeeting where TMeetingRegionTable : class, IMeetingRegion
        {
            var meetingRegions = new List<MeetingRegion>();

            var regions = dbContext.Region;

            foreach (var meeting in meetingTable.Include(x => x.Type))
            {
                // AA regions can be set automatically from the name as this is the main region select options.
                if (meeting.Type.Namespace == "AA" && !String.IsNullOrEmpty(meeting.RegionName) && !String.IsNullOrEmpty(meeting.RegionArea) && meeting.RegionArea != "UK")
                {
                    var regionId = regions.Where(x => x.Name == meeting.RegionName).Select(x => x.Id).FirstOrDefault();
                    if (regionId != 0)
                    {
                        meetingRegions.Add(new MeetingRegion()
                        {
                            MeetingId = meeting.Id,
                            RegionId = regionId
                        });
                    }
                }
            
                // Lookup region ID using convex hull contains algorithm.
                // Include AA regions as they may be located inside multiple region selections.
                foreach (var region in regions)
                {
                    // Check if lat / lon is inside convex hull.
                    var geometryFactory = new PreparedGeometryFactory();
                    var convexHullGeometry = geometryFactory.Create(region.ConvexHull);

                    // We will get some duplicate meeting IDs because of edge cases on convex hull boundaries.
                    if (convexHullGeometry.Contains(new Point(meeting.Location.X, meeting.Location.Y) { SRID = 4326 })) 
                    {
                        meetingRegions.Add(new MeetingRegion()
                        {
                            MeetingId = meeting.Id,
                            RegionId = region.Id
                        });
                    }
                }
            }

            meetingRegions = meetingRegions.DistinctBy(x => new { x.MeetingId, x.RegionId }).ToList();

            // Create AutoMapper configuration. Ignore missing fields.
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MeetingRegion, TMeetingRegionTable>();
            });
            var mapper = config.CreateMapper();

            // Convert meeting type.
            var meetingsForTable = mapper.Map<List<MeetingRegion>, List<TMeetingRegionTable>>(meetingRegions);

            // Add meeting regions to table.
            meetingRegionTable.AddRange(meetingsForTable);
            dbContext.SaveChanges();
        }

        private static void CreateMeetingFormatTable()
        {
            Console.WriteLine("Insert MeetingFormat");

            // Get formats for meeting data.
            var meetingFormats = new List<MeetingFormat>();
            foreach (var meeting in dbContext.Meeting)
            {
                if (meeting.Format == null) continue;

                foreach (var format in meeting.Format.Split(','))
                {
                    if (string.IsNullOrEmpty(format)) continue;

                    var meetingId = meeting.Id;
                    var formatId = dbContext.Format.Where(x => x.Name == format.Trim() && x.TypeId == meeting.TypeId).FirstOrDefault().Id;

                    // Add meeting format to result set.
                    meetingFormats.Add(new MeetingFormat()
                    {
                        MeetingId = meetingId,
                        FormatId = formatId,
                    });
                }
            }

            // Insert into MeetingFormatTable
            dbContext.MeetingFormat.AddRange(meetingFormats);
            dbContext.SaveChanges();
        }

        private static void CreateStatisticTable()
        {
            Console.WriteLine("Insert Statistics");

            var types = dbContext.Type;
            var countries = dbContext.Country;

            using (var reader = new StreamReader(DataDumpPath + "statistics.csv", Encoding.UTF8))
            {
                var statistics = new List<RMF.DAL.Entities.Statistic>();
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    // Read all CSV records.
                    csv.Context.RegisterClassMap<StatisticsCsvMap>();
                    var statisticRecordsCsv = csv.GetRecords<Statistic>().ToList();

                    foreach(var statisticRecordCsv in statisticRecordsCsv)
                    {
                        statistics.Add(new RMF.DAL.Entities.Statistic()
                        {
                            TypeId = types.Where(x => x.ShortName == statisticRecordCsv.Type).FirstOrDefault().Id,
                            CountryId = countries.Where(x=> x.Name == statisticRecordCsv.Country).FirstOrDefault().Id,
                            Total = statisticRecordCsv.Total,
                            LastUpdated = statisticRecordCsv.LastUpdated
                        });
                    }
                }

                // Insert into Statistics table.
                dbContext.Statistic.AddRange(statistics);
                dbContext.SaveChanges();
            }
        }

        private static void CreateDataDumpTable()
        {
            Console.WriteLine("Insert DataDump");

            var dataDumpFoldersDates = GetDataDumpFolderDates();
            var dataDumps = new List<DataDump>();
            foreach(var dataDumpFolderDate in dataDumpFoldersDates)
            {
                var dataDump = new DataDump()
                {
                    Date = dataDumpFolderDate
                };
                dataDumps.Add(dataDump);
            }

            dbContext.DataDump.AddRange(dataDumps);
            dbContext.SaveChanges();
        }

        private static void CreateWebDataDump()
        {
            Console.WriteLine("Create Website Data Dump");

            // Delete existing data dump folder.
            if (Directory.Exists(WebDataDumpPath + LatestDataDumpDate))
                Directory.Delete(WebDataDumpPath + LatestDataDumpDate, true);
            Directory.CreateDirectory(WebDataDumpPath + LatestDataDumpDate);

            // Delete existing statistics.csv file
            var allStatisticsFilename = "statistics.csv";
            if (File.Exists(WebDataDumpPath + allStatisticsFilename))
                File.Delete(WebDataDumpPath + allStatisticsFilename);
            File.Copy(DataDumpPath + allStatisticsFilename, WebDataDumpPath + allStatisticsFilename);

            // Copy regions dump.
            var regionsDump = LatestDataDumpDate + @"\regions-" + LatestDataDumpDate + ".csv";
            File.Copy(DataDumpPath + regionsDump, WebDataDumpPath + regionsDump);

            // Copy regions dump.
            var statisticsDump = LatestDataDumpDate + @"\statistics-" + LatestDataDumpDate + ".csv";
            File.Copy(DataDumpPath + statisticsDump, WebDataDumpPath + statisticsDump);

            var meetingDumpPath = WebDataDumpPath + LatestDataDumpDate + @"\meetings";
                        
            var outputPath =  meetingDumpPath + "-" + LatestDataDumpDate + ".csv";
            CreateMeetingsDataDump(dbContext.Meeting, dbContext.MeetingRegion, outputPath);

            outputPath = meetingDumpPath + "-added-" + LatestDataDumpDate + ".csv";
            CreateMeetingsDataDump(dbContext.MeetingAdded, dbContext.MeetingAddedRegion, outputPath);

            outputPath = meetingDumpPath + "-removed-" + LatestDataDumpDate + ".csv";
            CreateMeetingsDataDump(dbContext.MeetingRemoved, dbContext.MeetingRemovedRegion, outputPath);
        }

        private static void CreateMeetingsDataDump<TMeetingTable, TMeetingRegionTable>(DbSet<TMeetingTable> meetingTable, DbSet<TMeetingRegionTable> meetingRegionTable, string outputPath)  where TMeetingTable : class, IMeeting where TMeetingRegionTable : class, IMeetingRegion
        {
            // Create meetings dump from database.
            var meetingsCsv = new List<MeetingDumpCsv>();
            foreach (var meeting in meetingTable.Include(x => x.Day).Include(x => x.Type))
            {
                var meetingRegion = meetingRegionTable.Where(x => x.MeetingId == meeting.Id).FirstOrDefault();
                Region region = null;
                if (meetingRegion != null)
                    region = dbContext.Region.Where(x => x.Id == meetingRegion.RegionId).Include(x => x.Area).Include(x => x.Country).FirstOrDefault();

                var meetingCsv = new MeetingDumpCsv()
                {
                    Guid = meeting.Guid,
                    Title = meeting.Title,
                    Time = meeting.Time.ToString("HH:mm"),
                    Duration = meeting.Duration,
                    Postcode = meeting.Postcode,
                    Latitude = meeting.Location.Y,
                    Longitude = meeting.Location.X,
                    Venue = meeting.Venue,
                    Address = meeting.Address,
                    What3Words = meeting.What3Words,
                    Day = meeting.Day.Name,
                    Hearing = meeting.Hearing,
                    Wheelchair = meeting.Wheelchair,
                    Chit = meeting.Chit,
                    Open = meeting.Open,
                    OpenFormat = meeting.OpenFormat,
                    Format = meeting.Format,
                    Note = meeting.Note,
                    Region = region != null ? region.Name : String.Empty,
                    Area = region != null ? region.Area.Name : String.Empty,
                    Country = meeting.Country,
                    Type = meeting.Type.Name
                };

                meetingsCsv.Add(meetingCsv);
            }

            // Order results.
            meetingsCsv = meetingsCsv.OrderBy(x => x.Type).ThenBy(x => x.Country).ThenBy(x => x.Region).ToList();

            // Write CSV file.
            var csvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture);

            // Append meetings to a CSV file.
            using (FileStream fs = new FileStream(outputPath, FileMode.Append, FileAccess.Write))
            {
                using (var sw = new StreamWriter(fs, Encoding.UTF8))
                {
                    // Write regions meetings to CSV.
                    using (var csv = new CsvWriter(sw, csvConfiguration))
                    {
                        csv.WriteRecords(meetingsCsv);
                    }
                }
            }
        }

        private static void BackupDatabase()
        {
            Console.WriteLine("Create Backup");
            var dbName = dbContext.Database.GetDbConnection().Database;
            //dbContext.Database.ExecuteSqlRaw("DROP TABLE MeetingDataDump;");
            var sqlCommand = @"BACKUP DATABASE [" + dbName + @"] TO DISK='" + DbBackupFilePath + "'";
            dbContext.Database.ExecuteSqlRaw(sqlCommand);
        }

        private static bool CheckFieldLengths(IEnumerable<Meeting> records)
        {
            var result = true;
            foreach (var meeting in records)
            {
                if (meeting.Title.Length > 250)
                    result = false;
                else if (meeting.Time.Length > 5)
                    result = false;
                else if (meeting.Duration.Length > 35)
                    result = false;
                else if (meeting.Postcode.Length > 10)
                    result = false;
                else if (meeting.Venue.Length > 250)
                    result = false;
                else if (meeting.Address.Length > 250)
                    result = false;
                else if (meeting.Day.Length > 10)
                    result = false;
                else if (meeting.OpenFormat.Length > 250)
                    result = false;
                else if (meeting.Format.Length > 250)
                    result = false;
                else if (meeting.Note.Length > 1500)
                    result = false;
                else if (meeting.Code.Length > 100)
                    result = false;
                else if (meeting.Region.Length > 100)
                    result = false;
                else if (meeting.RegionArea.Length > 100)
                    result = false;
                else if (meeting.MeetingType.Length > 50)
                    result = false;
                else if (meeting.MeetingTypeNamespace.Length > 10)
                    result = false;
            }
            return result;
        }
    }
}