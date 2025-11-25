using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Stream.Helpers;
using Stream.Models;

namespace Stream.ViewModels
{
    public class MainViewModel: BindableObject
    {
        public ObservableCollection<VideoModel> Videos { get; set; } = new ObservableCollection<VideoModel>();
        public ICommand ShowVideos { get; private set; }
        public ICommand NavigateToStreamPage { get; private set; }

        public MainViewModel()
        {
            ShowVideos = new Command(GetVideos);
            NavigateToStreamPage = new Command(Navigate);
        }



        private async void GetVideos()
        {
            try
            {
                IEnumerable<VideoModel> videos = await VideosService.GetVideos();
                Videos.Clear();
                foreach (var v in videos)
                {
                    string thumb = v.Thumbnail;
                    v.Thumbnail = $"http://192.168.1.70:3000/thumbnails/2021-12-29-1017-55_thumb.jpg";
                    Videos.Add(v);
                }

            }
            catch (Exception ex)
            {
                await App.Current!.MainPage!.DisplayAlert("Hiba történt!", $"{ex.Message}","OK");
            }
        }

        private async void Navigate(object obj)
        {
            string? fileName = obj as string;
            if (!string.IsNullOrWhiteSpace(fileName))
            {
                Dictionary<string, object> navParams = new Dictionary<string, object> { { "FileName", fileName } };
                await AppShell.Current.GoToAsync("video", navParams);
                //return;
            }
            //TODO error handling
            //await App.Current!.MainPage!.DisplayAlert("Hiba történt!", $"Érvénytelen fájlnév.", "Vissza");
            //await AppShell.Current.GoToAsync("..");


        }
    }
}
