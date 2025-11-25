using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Stream.Models;

namespace Stream.Helpers
{
    public static class VideosService
    {
        private static string url = Config.BaseUrl;
        public static async Task<IEnumerable<VideoModel>> GetVideos()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new System.Uri(url);
                string uri = "/videos";
                var response = await client.GetStringAsync(uri);
                return JsonConvert.DeserializeObject<List<VideoModel>>(response)!;
            }
        }

        public static async Task<string> GetVideoWithRangeAsync(string filename)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Range = new System.Net.Http.Headers.RangeHeaderValue(50000, 100000);

                client.BaseAddress = new System.Uri(url);

                string uri = $"/videos/{filename}";
                HttpResponseMessage response = await client.GetAsync(uri);
                if (response.IsSuccessStatusCode)
                {
                    return url;
                }
                return null;
            }
        }
    }
}
