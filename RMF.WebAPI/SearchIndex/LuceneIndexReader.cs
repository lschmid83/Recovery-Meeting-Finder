using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Lucene.Net.Util;
using System;
using System.IO;

namespace RMF.WebAPI.SearchIndex
{
    public class LuceneIndexReader
    {
        public DirectoryReader ReadIndex(bool inDevelopment)
        {
            // Open the Directory using a Lucene Directory class.
            var indexName = "rmf_lucene_index";
            var indexPath = Path.Combine(Environment.CurrentDirectory, indexName);
            if (inDevelopment)
                indexPath = Path.Combine(@"c:\data\", indexName);

            using Lucene.Net.Store.Directory indexDir = FSDirectory.Open(indexPath);

            // Create an index reader.
            var reader = IndexReader.Open(indexDir);

            return reader;
        }

    }
}
