namespace RMF.WebAPI.Client.Models
{
    public class Region
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int Zoom { get; set; }

        public int AreaId { get; set; }

        public  Area Area { get; set; }

        public Country Country { get; set; }
    }
}
