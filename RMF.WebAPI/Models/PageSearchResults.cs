using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.WebAPI.Models
{
    public class PageSearchResults
    {
        public string SearchTerm { get; set; }
        public List<PageSearchResult> Results { get; set; } = new List<PageSearchResult>();
        public int TotalResults { get; set; }
    }
}
