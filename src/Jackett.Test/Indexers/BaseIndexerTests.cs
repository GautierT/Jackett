using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Jackett.Common.Indexers;
using Jackett.Common.Models;
using Jackett.Common.Models.Config;
using Jackett.Common.Models.IndexerConfig;
using Jackett.Common.Utils.Clients;
using Newtonsoft.Json.Linq;
using NLog;
using NUnit.Framework;
using WebClient = Jackett.Common.Utils.Clients.WebClient;
using WebRequest = Jackett.Common.Utils.Clients.WebRequest;

namespace Jackett.Test.Indexers
{
    public class TestWebClient : WebClient
    {
        private readonly WebClientByteResult _expectedResponse;

        public TestWebClient(Logger l, WebClientByteResult expectedResponse) : base(null, l, null, new ServerConfig(new RuntimeSettings()))
            => _expectedResponse = expectedResponse;

        protected override async Task<WebClientByteResult> Run(WebRequest webRequest)
        {
            Console.WriteLine($@"TestWebClient Call Run (webRequest: {webRequest})");
            return await Task.FromResult(_expectedResponse);
        }

        public override void Init() => Console.WriteLine(@"TestWebClient Call Init");
    }

    class TestBaseWebIndexer : BaseWebIndexer
    {
        public TestBaseWebIndexer(WebClient webClient, Logger l)
            : base("Test indexer",
                   description: "Test description",
                   link: "https://test.com/",
                   caps: new TorznabCapabilities(),
                   configService: null,
                   client: webClient,
                   logger: l,
                   p: null,
                   configData: new ConfigurationData())
        {
            Encoding = Encoding.UTF8;
            Language = "en-us";
            Type = "private";
        }

        public override Task<IndexerConfigurationStatus> ApplyConfiguration(JToken configJson)
            => throw new NotImplementedException();

        protected override async Task<IEnumerable<ReleaseInfo>> PerformQuery(TorznabQuery query)
        {
            Console.WriteLine($@"TestBaseWebIndexer Call PerformQuery (query: {query})");

            // generated data (fake)
            var testUrl = "https://test.com/release";
            var testUri = new Uri(testUrl);
            var testRelease = new ReleaseInfo
            {
                Link = testUri,
                Guid = testUri
            };

            // test request
            var response = await RequestStringWithCookies(testUrl);
            Console.WriteLine($@"TestBaseWebIndexer Call RequestStringWithCookies (response: {response})");

            // return generated releases
            var releases = new List<ReleaseInfo>();
            for (var i = 0; i < 100; i++)
                releases.Add(testRelease);
            return await Task.FromResult(releases);
        }
    }

    [TestFixture]
    public class BaseWebIndexerTests
    {
        private Logger _logger = LogManager.GetCurrentClassLogger();

        [Test]
        public void TestBaseWebIndexerResolveCookies()
        {
            var expectedResponse = new WebClientByteResult
            {
                Content = Encoding.UTF8.GetBytes("test content"),
                Status = HttpStatusCode.OK,
                Cookies = "test_cookie_key=test_cookie_value;"
            };

            var webClient = new TestWebClient(_logger, expectedResponse);
            var webIndexer = new TestBaseWebIndexer(webClient, _logger);
            var results = webIndexer.ResultsForQuery(new TorznabQuery {QueryType = "search"});

            // I want to test the cookie after the request
            StringAssert.Equals("test_cookie_key=test_cookie_value;", webIndexer.CookieHeader);


            //StringAssert.Equals(100, results.Result.Releases);
        }
    }
}
