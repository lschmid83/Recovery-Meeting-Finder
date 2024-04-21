using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace RMF.DAL.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Area",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Area", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataDump",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataDump", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Day",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Day", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MeetingDataDump",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Time = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: false),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Day = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegionArea = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegionAreaOrder = table.Column<int>(type: "int", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeetingType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MeetingTypeNamespace = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingDataDump", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PageIndex",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Path = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageIndex", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PreviousMeetingDataDump",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Time = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: false),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Day = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegionArea = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegionAreaOrder = table.Column<int>(type: "int", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeetingType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MeetingTypeNamespace = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreviousMeetingDataDump", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Type",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Namespace = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Type", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Region",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Zoom = table.Column<int>(type: "int", nullable: false),
                    AreaId = table.Column<int>(type: "int", nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    ConvexHull = table.Column<Geometry>(type: "geography", nullable: false),
                    Boundary = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Region", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Region_Area_AreaId",
                        column: x => x.AreaId,
                        principalTable: "Area",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Region_Country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Country",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Format",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Format", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Format_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Meeting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DayId = table.Column<int>(type: "int", nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    RegionArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hash = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meeting", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meeting_Day_DayId",
                        column: x => x.DayId,
                        principalTable: "Day",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Meeting_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MeetingAdded",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DayId = table.Column<int>(type: "int", nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    RegionArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hash = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingAdded", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingAdded_Day_DayId",
                        column: x => x.DayId,
                        principalTable: "Day",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingAdded_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingRemoved",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DayId = table.Column<int>(type: "int", nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    RegionArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hash = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingRemoved", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingRemoved_Day_DayId",
                        column: x => x.DayId,
                        principalTable: "Day",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingRemoved_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PreviousMeeting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", maxLength: 5, nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    Postcode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Location = table.Column<Point>(type: "geography", nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    What3Words = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DayId = table.Column<int>(type: "int", nullable: false),
                    Hearing = table.Column<bool>(type: "bit", nullable: false),
                    Wheelchair = table.Column<bool>(type: "bit", nullable: false),
                    Chit = table.Column<bool>(type: "bit", nullable: false),
                    Open = table.Column<bool>(type: "bit", nullable: false),
                    OpenFormat = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Format = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    RegionArea = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hash = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreviousMeeting", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PreviousMeeting_Day_DayId",
                        column: x => x.DayId,
                        principalTable: "Day",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PreviousMeeting_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Statistic",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statistic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Statistic_Country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Country",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Statistic_Type_TypeId",
                        column: x => x.TypeId,
                        principalTable: "Type",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingFormat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    FormatId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingFormat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingFormat_Format_FormatId",
                        column: x => x.FormatId,
                        principalTable: "Format",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingAddedRegion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    RegionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingAddedRegion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingAddedRegion_Meeting_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingRegion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    RegionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingRegion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingRegion_Meeting_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingRemovedRegion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingId = table.Column<int>(type: "int", nullable: false),
                    RegionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingRemovedRegion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingRemovedRegion_Meeting_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Format_TypeId",
                table: "Format",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Meeting_DayId_TypeId_Hearing_Wheelchair_Open",
                table: "Meeting",
                columns: new[] { "DayId", "TypeId", "Hearing", "Wheelchair", "Open" });

            migrationBuilder.CreateIndex(
                name: "IX_Meeting_TypeId",
                table: "Meeting",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAdded_DayId",
                table: "MeetingAdded",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAdded_TypeId",
                table: "MeetingAdded",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAddedRegion_MeetingId",
                table: "MeetingAddedRegion",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingFormat_FormatId",
                table: "MeetingFormat",
                column: "FormatId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingFormat_MeetingId_FormatId",
                table: "MeetingFormat",
                columns: new[] { "MeetingId", "FormatId" });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRegion_MeetingId",
                table: "MeetingRegion",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRemoved_DayId",
                table: "MeetingRemoved",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRemoved_TypeId",
                table: "MeetingRemoved",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingRemovedRegion_MeetingId",
                table: "MeetingRemovedRegion",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_PreviousMeeting_DayId",
                table: "PreviousMeeting",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_PreviousMeeting_TypeId",
                table: "PreviousMeeting",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Region_AreaId_CountryId",
                table: "Region",
                columns: new[] { "AreaId", "CountryId" });

            migrationBuilder.CreateIndex(
                name: "IX_Region_CountryId",
                table: "Region",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Statistic_CountryId",
                table: "Statistic",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Statistic_TypeId",
                table: "Statistic",
                column: "TypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataDump");

            migrationBuilder.DropTable(
                name: "MeetingAdded");

            migrationBuilder.DropTable(
                name: "MeetingAddedRegion");

            migrationBuilder.DropTable(
                name: "MeetingDataDump");

            migrationBuilder.DropTable(
                name: "MeetingFormat");

            migrationBuilder.DropTable(
                name: "MeetingRegion");

            migrationBuilder.DropTable(
                name: "MeetingRemoved");

            migrationBuilder.DropTable(
                name: "MeetingRemovedRegion");

            migrationBuilder.DropTable(
                name: "PageIndex");

            migrationBuilder.DropTable(
                name: "PreviousMeeting");

            migrationBuilder.DropTable(
                name: "PreviousMeetingDataDump");

            migrationBuilder.DropTable(
                name: "Region");

            migrationBuilder.DropTable(
                name: "Statistic");

            migrationBuilder.DropTable(
                name: "Format");

            migrationBuilder.DropTable(
                name: "Meeting");

            migrationBuilder.DropTable(
                name: "Area");

            migrationBuilder.DropTable(
                name: "Country");

            migrationBuilder.DropTable(
                name: "Day");

            migrationBuilder.DropTable(
                name: "Type");
        }
    }
}
