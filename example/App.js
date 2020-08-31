import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
} from 'react-native';

import {GifSearch} from 'react-native-gif-search';

const DEVELOPMENT_MODE = false;

export default class App extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          gif_url: null
      }
  }

  onGifSelected = (gif_url) => {
      this.setState({gif_url})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 250}}>
            <GifSearch
              style={{backgroundColor: 'yellow', borderRadius: 0}}
              textInputStyle={{fontWeight: 'bold', color: 'black'}}
              gifStyle={{height:160}}
              loadingSpinnerColor={'black'}
              placeholderTextColor={'grey'}
              darkGiphyLogo={true}
              giphyApiKey={"NctafbvmG7x6Z1HyDVsd5gvB5SBf87ZE"}
              onGifSelected={this.onGifSelected}
              visible={true}
              developmentMode={DEVELOPMENT_MODE}
              horizontal={true}
              onError={(error) => {console.log(error)}}
            />
        </View>
        <View style={styles.gifPreview}>
            {this.state.gif_url ?
            (
              <View>
                <Text style={{textAlign:'center'}}>Selected Gif:</Text>
                <View style={styles.gifContainer}>
                    <Image
                      style={styles.gif}
                      source={{ uri: this.state.gif_url}}
                    />
                    {!DEVELOPMENT_MODE ?
                    (
                      <Image 
                        source={require('example/img/PoweredBy_200px-White_HorizText.png')} 
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
                <Text style={{textAlign:'center'}}>Selected Gif: None</Text>
              </View>
            )
            }
            
        </View>

      </View>
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
    alignItems: 'center'
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