using Lucene.Net.Analysis;
using Lucene.Net.Analysis.En;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Lucene.Net.Search.Highlight;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Microsoft.AspNetCore.Mvc;
using RMF.WebAPI.Client.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PageSearchController : ControllerBase
    {
        private readonly DirectoryReader LuceneIndex;

        public PageSearchController(DirectoryReader luceneIndex)
        {
            LuceneIndex = luceneIndex;
        }

        [HttpGet]
        [Route("~/page-search")]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "*" })]
        public PageSearchResults Get(string query, int maxContentLength = 500)
        {
            if (String.IsNullOrEmpty(query))
                return new PageSearchResults();
      
            // Open index.
            var luceneVersion = LuceneVersion.LUCENE_48;
            var standardAnalyzer = new EnglishAnalyzer(luceneVersion);
            var searcher = new IndexSearcher(LuceneIndex);

            // Run query.
            var parser = new QueryParser(luceneVersion, "content", standardAnalyzer);
            var luceneQuery = parser.Parse(query);
            var hits = searcher.Search(luceneQuery, n: 19);

            // Hightlight results.
            var htmlFormatter = new SimpleHTMLFormatter("<span class='highlight'>", "</span>");
            var highlighter = new Highlighter(htmlFormatter, new QueryScorer(luceneQuery))
            {
                TextFragmenter = new SimpleFragmenter(100000)
            };

            // Create results.
            var results = new PageSearchResults
            {
                SearchTerm = query,
                TotalResults = hits.TotalHits
            };

            // Loop through document hits.
            for (int a = 0; a < hits.ScoreDocs.Length; a++)
            {
                // Get document.
                var id = hits.ScoreDocs[a].Doc;
                var doc = searcher.Doc(id);
                
                // Highlight keywords.
                var text = doc.Get("content");
                var tokenStream = TokenSources.GetAnyTokenStream(searcher.IndexReader, id, "content", standardAnalyzer);
                var frag = highlighter.GetBestTextFragments(tokenStream, text, mergeContiguousFragments: false, maxNumFragments: 1);

                // Get results.
                var path = doc.Get("path");
                var title = doc.Get("title");
                var contentFragment = frag.First().ToString();

                // Split content by new lines.
                var contentLines = contentFragment.Split(new string[] { "\r\n" }, StringSplitOptions.None);

                // Find first highlight in fragment.
                var fragmentIndex = 0;
                for(var b = 0; b < contentLines.Length; b++)
                {
                    if (contentLines[b].Contains("<span class='highlight'>")) {
                        fragmentIndex = b;
                        break;
                    }
                }

                // Add fragments until content length reaches max length.
                var content = string.Empty;
                while(content.Length < maxContentLength)
                {
                    content += contentLines[fragmentIndex] + " ";
                    fragmentIndex++;
                    if (fragmentIndex >= contentLines.Length)
                        break;
                }

                content = content.Trim();

                if (content.Length >= maxContentLength - 4)
                    content = content.Substring(0, maxContentLength - 4) + " ...";
                else
                    content += " ...";

                // Add to results.
                results.Results.Add(new PageSearchResult()
                {
                    Path = path,
                    Title = title,
                    Content = content
                }); 
            }
            return results;
        }
    }
}
