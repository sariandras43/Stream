namespace Stream.Views;

public partial class VideoView : ContentPage
{
	public VideoView()
	{
		InitializeComponent();
	}

    protected override bool OnBackButtonPressed()
    {
        var navigationStack = Navigation.NavigationStack;

        foreach (var page in navigationStack)
        {
            Navigation.RemovePage(page);
        }
        return true;
    }
}