import React from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Image,
} from 'react-native';

import {GifSearch, giphyLogo, giphyLogoDark} from 'react-native-gif-search';

const DEVELOPMENT_MODE = false;

export default class App extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          gif_url: null
      }
  }

  onGifSelected = (gif_url, gif_object) => {
      this.setState({gif_url})
  }

  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={"handled"}>
        <GifSearch
          giphyApiKey={"NctafbvmG7x6Z1HyDVsd5gvB5SBf87ZE"}
          gifsToLoad={10}
          maxGifsToLoad={25}
          style={{backgroundColor: '#9fd4ab'}}
          textInputStyle={{fontWeight: 'bold', color: 'black'}}
          gifStyle={{height:160}}
          loadingSpinnerColor={'black'}
          placeholderTextColor={'grey'}
          darkGiphyLogo={true}
          onGifSelected={this.onGifSelected}
          visible={true}
          developmentMode={DEVELOPMENT_MODE}
          horizontal={true}
          showScrollBar={false}
          onError={(error) => {console.log(error)}}
          noGifsFoundText={"No Gifs found :("}
          noGifsFoundTextStyle={{fontWeight: 'bold'}}
          textInputProps={{autoFocus: true}}
        />
        <View style={styles.gifPreview}>
            {this.state.gif_url ?
            (
              <View>
                <Text style={{textAlign:'center', fontSize: 20}}>Selected Gif:</Text>
                <View style={styles.gifContainer}>
                    <Image
                      style={styles.gif}
                      source={{ uri: this.state.gif_url}}
                    />
                    {!DEVELOPMENT_MODE ?
                    (
                      <Image 
                        source={giphyLogoDark} 
                        style={styles.giphyLogo}
                      />
                    )
                    :
                    (null)
                    }
                </View>
              </View>
            )
            :
            (
              <View>
                <Text style={{textAlign:'center', fontSize: 20}}>Selected Gif: None</Text>
              </View>
            )
            }
            
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gifPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  gifContainer: {
    width: 210,
    height: 215,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 8
  },
  gif: {
    width: 190, height: 160,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  giphyLogo: {
    width: 190,
    height:15,
    resizeMode: 'contain',
    marginTop: 13,
    marginBottom: 2
  }
});