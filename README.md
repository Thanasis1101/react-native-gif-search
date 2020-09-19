# react-native-gif-search
> An easy-to-use, highly customizable react-native package for searching and selecting a gif using the Giphy API.

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-gif-search"><img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-gif-search.svg"/></a>
  <a href="https://www.npmjs.com/package/react-native-gif-search"><img alt="npm version" src="https://badge.fury.io/js/react-native-gif-search.svg"/></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search%20screenshot%201.jpg" width="250" title="react-native-gif-searc screenshot 1">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search-with-giphy-logo.gif" width="250" title="react-native-gif-search-with-giphy-logo">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search-without-giphy-logo.gif" width="250" title="react-native-gif-search-without-giphy-logo">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search%20screenshot%202.jpg" width="757" title="react-native-gif-searc screenshot 2">
</p>


This package allows you to present a searchable list of gifs to the user, from which the user can select the desired gif. In the beginning and when the search term is empty, a list of **trending gifs** is shown. You can use this component inside a chat screen, for posts, comments or wherever else you need. It uses the [Giphy API](https://developers.giphy.com/) so you need to create an account and obtain an API key which is free and easy. [This article](https://medium.com/just-ship-it-coding/integrating-giphy-api-in-react-native-8dc55dc172c8) was helpful for creating this package and has instrauctions on how to get an API key.

If you wish to **publish your app** and go from development to production you need to upgrade the API key. To do so, you must verify that you have used the Giphy attribution marks (Giphy logos) in your app, by providing screenshots and videos from your app. The verification process can take up to 3 days. The `react-native-gif-search` package can help you with this too, because it has a property for adding dark or white version of the powered by Giphy logo (`developmentMode={false}`) as you can see in the preview above.

The gifs that are displayed in the gifs list are low quality previews, in order to load faster and minimize mobile data usage. The gif that the user selects is given in a higher quality, so that it can be used and displayed properly in the app.

## Installation

```
npm install react-native-gif-search --save
```

### Android

In your project's folder go to file `android/app/build.gradle` and inside dependencies block add these lines:
```
implementation 'com.facebook.fresco:fresco:2.0.0'
implementation 'com.facebook.fresco:animated-gif:2.0.0'
```

## Usage
### Import

```
import {GifSearch} from 'react-native-gif-search'
```

### Minimal example

  
```
<GifSearch
  giphyApiKey={YOUR_GIPHY_API_KEY}
  onGifSelected={(gif_url)=>{alert(gif_url)}}
/>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search%20screenshot%203.jpg" width="300" title="react-native-gif-searc screenshot 3">
</p>


### Bigger example
```
<GifSearch
  giphyApiKey={YOUR_GIPHY_API_KEY}
  gifsToLoad={10}
  maxGifsToLoad={25}
  style={{backgroundColor: 'white', borderWidth: 3, borderRadius: 10}}
  textInputStyle={{fontWeight: 'bold', color: 'black'}}
  gifListStyle={{height:320}}
  gifStyle={{height:160}}
  loadingSpinnerColor={'black'}
  placeholderTextColor={'grey'}
  placeholderText={'Search'}
  darkGiphyLogo={true}
  onGifSelected={(gif_url, gif_object) => {console.log(gif_url); console.log(gif_object)}}
  onGifLongPress={(gif_url, gif_object) => {console.log(gif_url); console.log(gif_object)}}
  visible={this.state.visible}
  onBackPressed={() => {this.setState({visible: false})}}
  developmentMode={false}
  horizontal={false}
  showScrollBar={false}  
  noGifsFoundText={"No Gifs found :("}
  noGifsFoundTextStyle={{fontWeight: 'bold'}}
  textInputProps={{autoFocus: true}}
  onError={(error) => {console.log(error)}}
/>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search%20screenshot%204.jpg" width="250" title="react-native-gif-searc screenshot 4">
</p>

### Multiple columns example
```
<GifSearch
  giphyApiKey={YOUR_GIPHY_API_KEY}
  onGifSelected={(gif_url)=>{alert(gif_url)}}
  style={{backgroundColor: '#9fd4ab', height:300}}
  textInputStyle={{fontWeight: 'bold', color: 'black'}}
  loadingSpinnerColor={'black'}
  placeholderTextColor={'grey'}
  darkGiphyLogo={true}
  numColumns={5}
  developmentMode={false}
  showScrollBar={false}
  noGifsFoundText={"No Gifs found :("}
/>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Thanasis1101/react-native-gif-search/master/Preview/react-native-gif-search%20screenshot%205.jpg" width="250" title="react-native-gif-searc screenshot 5">
</p>

You can see a full example project in the [example](example/) folder and more specifically in the [App.js](example/App.js) file.

# Properties

| Property name | Required | Explanation | Default |
| --- | --- | --- | --- |
| `giphyApiKey` | Yes | The Giphy API key you obtained (see step 1 [here](https://medium.com/just-ship-it-coding/integrating-giphy-api-in-react-native-8dc55dc172c8)) |  |
| `onGifSelected` | Yes | Function to be called when user clicked on a gif. The parameters of this function is a string with the url of the selected gif in better quality and the whole Giphy object in case the developer wants to use a different url or more info about the selected gif. See the properties of a Giphy object [here](https://developers.giphy.com/docs/api/schema/). | |
| `gifsToLoad` | No | How many gifs to load in the beginning and every time the user reaches the scroll end | `15` |
| `maxGifsToLoad` | No | On how many gifs to stop loading more gifs | `60` |
| `developmentMode` | No | Giphy logo appears on top right corner, if set to false (this is required by Giphy when publishing your app) | `true` |
| `darkGiphyLogo` | No | Used with `developmentMode={false}` shows the gray Giphy logo if set to true, or the white Giphy logo if set to false | `false` |
| `placeholderText` | No | The text for when there is no search term | `'Search GIF'` |
| `visible` | No | Can be used for toggling the view for the gif selection (e.g. open on button press) | `true` |
| `onBackPressed` | No | Function for when the device's back button is pressed. Used with `visible={this.state.visible}` for closing the gif selection when back button is pressed. If not set then default action is taken. If set then default action is ignored while gif selection is visible. Recommended usage: `onBackPressed={() => {this.setState({visible: false})}}` | |
| `onError` | No | Function to be called when an error occures, e.g. no internet connection | |
| `horizontal` | No | Set the orientation of the list with the gifs. Horizontal if true, vertical if false  | `true` |
| `style` | No | The component's style property (e.g. `style={{backgroundColor: 'yellow', borderRadius: 5}}`) | |
| `textInputStyle` | No | The style of the search text input | |
| `gifStyle` | No | The style of the gif inside the list | |
| `gifListStyle` | No | The style for the FlatList used for displaying the gifs | |
| `loadingSpinnerColor` | No | The color of the loading spinner | `'white'` |
| `placeholderTextColor` | No | The color of the placeholder for the search text input | `'grey'` |
| `showScrollBar` | No | Whether to show or not the scroll bar / scroll indicator | `true` |
| `numColumns` | No | How many columns of gifs to show. When this is used, `horizontal` is automatically set to false | |
| `onGifLongPress` | No | Function to be called when the user long presses on a gif. The parameters of this function is a string with the url of the gif in better quality and the whole Giphy object in case the developer wants to use a different url or more info about the selected gif. See the properties of a Giphy object [here](https://developers.giphy.com/docs/api/schema/). | |
| `gifListProps` | No | Additional properties for the FlatList with the gifs | |
| `textInputProps` | No | Additional properties for the TextInput with the search term (e.g. `textInputProps={{autoFocus: true}}`) | |
| `noGifsFoundText` | No | Text to display when no gifs are found | `'No GIFS found'` |
| `noGifsFoundTextStyle` | No | The style of the text that is displayed when no gifs are found | |

## Version History

- v1.0.8
  - **No GIFS found**: Displaying a text when there are no gifs matching the search term. See [Properties](#properties) section.
  - **Autofocus on open**: Now you can autofocus on the search input when the GifSearch component is displayed. Just use `textInputProps={{autoFocus: true}}`.
  - **Fixes**:
    - The selected gif is now better quality with no lag (credits to [anthlasserre](https://github.com/anthlasserre) for noticing).
    - When keyboard is open and the user selects a gif, the keyboard now closes and the gif is selected. Previously it did not select the gif on first tap.     :warning: ***Warning***: If your GifSearch component is nested in a `ScrollView` you should add `keyboardShouldPersistTaps={"handled"}` property in the ScrollView (like in [example code](/example/App.js)).
  

- v1.0.7
  - **numColumns**: Displaying gifs in grid view with specific number of columns. See [Properties](#properties) section. Credits to [anthlasserre](https://github.com/anthlasserre) for suggesting and helping add this feature.
  - **gifListProps**: See [Properties](#properties) section. Credits to [anthlasserre](https://github.com/anthlasserre) for suggesting and helping add this feature.
  - **onGifLongPress**: Function for when the user long presses on a link. This can be used to show a bigger preview. See [Properties](#properties) section.



# License
[ISC](LICENSE)
