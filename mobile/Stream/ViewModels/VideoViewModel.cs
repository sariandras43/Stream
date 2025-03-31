using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using CommunityToolkit.Maui.Views;
using Stream.Helpers;

namespace Stream.ViewModels
{
    public class VideoViewModel : BindableObject, IQueryAttributable
    {
        public ICommand StartStream { get; private set; }

        private string fileName;

        public string FileName
        {
            get { return fileName; }
            set { fileName = value;OnPropertyChanged(); }
        }
        private string streamUrl;

        public string StreamUrl
        {
            get { return streamUrl; }
            set { streamUrl = value;OnPropertyChanged(); }
        }

        public VideoViewModel()
        {
            StartStream = new Command(StartVideo);
        }
        public void ApplyQueryAttributes(IDictionary<string, object> query)
        {
            string? converted = query["FileName"] as string;
            if (!string.IsNullOrWhiteSpace(converted))
            {
                FileName = (string)query["FileName"];
                StreamUrl = Config.BaseUrl + "/videos/" + FileName;
                App.Current!.MainPage!.DisplayAlert("Hiba történt!", StreamUrl, "Vissza");
            }
            else
            {
                App.Current!.MainPage!.DisplayAlert("Hiba történt!", $"Érvénytelen fájlnév.", "Vissza");
            }


        }

        private async void StartVideo()
        {
            string videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

            string StreamUrl = await VideosService.GetVideoWithRangeAsync(FileName);

        }
    }
}
