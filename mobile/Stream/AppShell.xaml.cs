using Stream.Views;

namespace Stream
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            Routing.RegisterRoute("video", typeof(VideoView));
        }
    }
}
