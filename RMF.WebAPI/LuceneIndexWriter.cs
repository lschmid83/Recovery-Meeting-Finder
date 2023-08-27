using Lucene.Net.Analysis;
using Lucene.Net.Analysis.En;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Store;
using Lucene.Net.Util;
using RMF.DAL.Repos.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;

namespace RMF.WebAPI
{
    public class LuceneIndexWriter
    {
        private readonly IPageIndexRepo PageIndexRepo;

        public LuceneIndexWriter(IPageIndexRepo pageIndexRepo)
        {
            PageIndexRepo = pageIndexRepo;
        }

        public void WriteIndex()
        {
            // Specify the compatibility version we want
            const LuceneVersion luceneVersion = LuceneVersion.LUCENE_48;

            // Open the Directory using a Lucene Directory class
            var indexName = "rmf_lucene_index";
            var indexPath = Path.Combine(Startup.LuceneIndexPath, indexName);
            using Lucene.Net.Store.Directory indexDir = FSDirectory.Open(indexPath);

            // Create an analyzer to process the text.
            var standardAnalyzer = new EnglishAnalyzer(luceneVersion);

            //Create an index writer
            var indexConfig = new IndexWriterConfig(luceneVersion, standardAnalyzer);
            indexConfig.OpenMode = OpenMode.CREATE;                          
            var writer = new IndexWriter(indexDir, indexConfig);

            // Create index.
            var pathField = new TextField("path", "", Field.Store.YES);
            var titleField = new TextField("title", "", Field.Store.YES);
            var contentField = new TextField("content", "", Field.Store.YES);
            var d = new Document()
            {
                pathField,
                titleField,
                contentField
            };

            // Add documents to index.
            foreach (var pageIndex in PageIndexRepo.GetAll().Result)
            {
                pathField.SetStringValue(pageIndex.Path);
                titleField.SetStringValue(pageIndex.Title);
                contentField.SetStringValue(pageIndex.Content);
                writer.AddDocument(d);
            }
            writer.Commit();
        }
    }
}
