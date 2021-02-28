import React, { PureComponent, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Text,
} from 'react-native';

import Requests from './Requests';

const GIPHY_BASE_URL = 'https://api.giphy.com/v1/';
const TENOR_BASE_URL = 'https://api.tenor.com/v1/';

const providers = {
  TENOR: "tenor",
  GIPHY: "giphy",
  ALL: "all",
}

const gif_types = {
  GIF: "gif",
  STICKER: "sticker",
  ALL: "all",
}

const endpoints = {
  TRENDING: "trending",
  SEARCH: "search",
}

class GifSearch extends PureComponent {

    constructor(props) {
      super(props);

      this.gifsToLoad = 15;
      if (props.gifsToLoad != null) {
          this.gifsToLoad = props.gifsToLoad;
      }
      this.maxGifsToLoad = 60;
      if (props.maxGifsToLoad != null) {
          this.maxGifsToLoad = props.maxGifsToLoad;
      }
      this.placeholderTextColor = 'grey';
      if (props.placeholderTextColor != null) {
          this.placeholderTextColor = props.placeholderTextColor;
      }
      this.giphyApiKey = '';
      if (props.giphyApiKey != null) {
          this.giphyApiKey = props.giphyApiKey;
      }
      this.tenorApiKey = '';
      if (props.tenorApiKey != null) {
          this.tenorApiKey = props.tenorApiKey;
      }
      this.loadingSpinnerColor = 'white';
      if (props.loadingSpinnerColor != null) {
          this.loadingSpinnerColor = props.loadingSpinnerColor;
      }
      this.showScrollBar = true;
      if (props.showScrollBar != null) {
          this.showScrollBar = props.showScrollBar;
      }
      this.placeholderText = "Search GIFs";
      if (props.placeholderText != null) {
          this.placeholderText = props.placeholderText;
      }
      this.stickersPlaceholderText = "Search Stickers";
      if (props.stickersPlaceholderText != null) {
          this.stickersPlaceholderText = props.stickersPlaceholderText;
      }
      this.noGifsFoundText = "No GIFS found";
      if (props.noGifsFoundText != null) {
          this.noGifsFoundText = props.noGifsFoundText;
      }
      this.horizontal = true;
      if (props.horizontal != null) {
          this.horizontal = props.horizontal;
      }      
      this.numColumns = 1;
      if (props.numColumns != null) {
          this.numColumns = props.numColumns;
          this.horizontal = false;
          this.gifSize = Dimensions.get('window').width / this.numColumns - 15;
      }
      this.provider = providers.ALL;
      if (props.provider != null) {
          if (props.provider == providers.TENOR || props.provider == providers.GIPHY) {
              this.provider = props.provider;
          }
      }      
      this.providerLogo = null;
      if (props.providerLogo != null) {
          this.providerLogo = props.providerLogo;
      }
      this.gifType = gif_types.GIF;
      var currentGifType = gif_types.GIF;
      if (props.gifType != null) {
          if (props.gifType == gif_types.STICKER) {
              this.gifType = props.gifType
              currentGifType = props.gifType;
          } 
          if (props.gifType == gif_types.ALL) {
            this.gifType = props.gifType
          }
      }
      this.showGifsButtonText = "Gifs";
      if (props.showGifsButtonText != null) {
          this.showGifsButtonText = props.showGifsButtonText;
      } 
      this.showStickersButtonText = "Stickers";
      if (props.showStickersButtonText != null) {
          this.showStickersButtonText = props.showStickersButtonText;
      }

      if (currentGifType == gif_types.STICKER) {
          this.provider = providers.GIPHY
      }
            
      this.state = {
        gifs: [],
        offset: 0,
        next: 0,
        scrollOffset: 0,
        search_term: "",
        fetching: false,
        gifsOver: false,
        noGifsFound: false,
        currentGifType: currentGifType,
        currentProvider: this.provider,
        gifSize: this.gifSize,
        visible: props.visible != null ? props.visible : true,
      }

  }

  refreshGifs = () => {
      this.setState({fetching: true, gifsOver: false, noGifsFound: false})
      if (this.state.search_term == ""){
          this.showGifs(endpoints.TRENDING)
      } else {
          this.showGifs(endpoints.SEARCH)
      }
  }

  handleRequestResponses = (tenorResponseJSON, giphyResponseJSON) => {
      if (tenorResponseJSON == null) {tenorResponseJSON = {results:[]}}
      if (giphyResponseJSON == null) {giphyResponseJSON = {data:[]}}

      if (tenorResponseJSON.results.length > 0 || giphyResponseJSON.data.length > 0) {

          var tenor_gifs = this.addProviderAndTypeInfo(tenorResponseJSON.results, providers.TENOR)
          var giphy_gifs = this.addProviderAndTypeInfo(giphyResponseJSON.data, providers.GIPHY)
          var all_gifs = this.joinAndRemoveDuplicateIds(this.state.gifs, this.interleaveGifArrays(tenor_gifs, giphy_gifs))
          this.setState({ 
              gifs: all_gifs,
              offset: this.state.offset + this.gifsToLoad,
              next: tenorResponseJSON.next,
              fetching: false
          })
      } else {
          this.setState({fetching: false, gifsOver: true, noGifsFound: this.state.gifs.length == 0})
      }
  }

  handleRequestError = (error) => {
      this.setState({fetching: false, gifsOver: true})
      if (this.props.onError) {
          this.props.onError(error)
      }
  }


  showGifs = (endpoint) => {

      const search_term = this.state.search_term;
      if (this.state.currentProvider == providers.ALL) {

          this.fetchTenorGifs(endpoint).then((tenorResponseJSON) => {              
              this.fetchGiphyGifs(endpoint).then((giphyResponseJSON) => {
                  if (search_term == this.state.search_term) {
                      this.handleRequestResponses(tenorResponseJSON, giphyResponseJSON)
                  }
              }).catch(this.handleRequestError)
          }).catch(this.handleRequestError)
        
      } else if (this.state.currentProvider == providers.TENOR) {

          this.fetchTenorGifs(endpoint).then((tenorResponseJSON) => { 
              if (search_term == this.state.search_term) {
                  this.handleRequestResponses(tenorResponseJSON, null)
              }
          }).catch(this.handleRequestError)

      } else if (this.state.currentProvider == providers.GIPHY) {

          this.fetchGiphyGifs(endpoint).then((giphyResponseJSON) => { 
              if (search_term == this.state.search_term) {
                  this.handleRequestResponses(null, giphyResponseJSON)
              }
          }).catch(this.handleRequestError)

      }
  }


  fetchTenorGifs = (endpoint) => {
      var limit = Math.min(this.gifsToLoad, this.maxGifsToLoad - this.state.offset)
      if (this.state.currentProvider == providers.ALL) { 
          limit = Math.ceil(limit/2)
      }

      if (endpoint == endpoints.TRENDING) {

          return Requests.fetch("GET", TENOR_BASE_URL + "trending", {
              "key": this.tenorApiKey,
              "limit": limit,
              "locale": "el_GR",
              "media_filter": "basic",
              "contentfilter": "medium",
              ...this.state.next != 0 && {"pos": this.state.next},
              ...this.props.tenorApiProps,
          })

      } else if (endpoint == endpoints.SEARCH) {

          return Requests.fetch("GET", TENOR_BASE_URL + "search", {
              "key": this.tenorApiKey,
              "q": this.state.search_term,
              "limit": limit,
              "locale": "el_GR",
              "media_filter": "basic",
              "contentfilter": "high",
              ...this.state.next != 0 && {"pos": this.state.next},
              ...this.props.tenorApiProps,
          })

      }
  }

  fetchGiphyGifs = (endpoint) => {
      var limit = Math.min(this.gifsToLoad, this.maxGifsToLoad - this.state.offset)
      if (this.state.currentProvider == providers.ALL) { 
          limit = Math.floor(limit/2)
      }

      var base_url = GIPHY_BASE_URL;
      if (this.state.currentGifType == gif_types.GIF) {
        base_url += "gifs/"
      } else if (this.state.currentGifType == gif_types.STICKER) {
        base_url += "stickers/"
      }
    
      if (endpoint == endpoints.TRENDING) {

          return Requests.fetch("GET", base_url + "trending", {
              "api_key": this.giphyApiKey,
              "limit": limit,
              "rating": "pg",
              "offset": this.state.offset,
              ...this.props.giphyApiProps,
          })

      } else if (endpoint == endpoints.SEARCH) {

          return Requests.fetch("GET", base_url + "search", {
              "api_key": this.giphyApiKey,
              "q": this.state.search_term,
              "limit": limit,
              "rating": "pg",
              "offset": this.state.offset,
              ...this.props.giphyApiProps,
          })

      }
  }

  joinAndRemoveDuplicateIds = (old_array, new_array) => {
      var new_array_unique = new_array.filter((obj1, index1) => {return !new_array.some((obj2, index2) => obj1.id === obj2.id && index1 != index2)}); // remove duplicates
      new_array_unique = new_array_unique.filter(o1 => {return !old_array.some(o2 => o1.id === o2.id)}); // remove duplicates with previous gifs
      return [...old_array, ...new_array_unique]
  }

  addProviderAndTypeInfo = (gifs_array, provider) => {
      gifs_array.forEach((element) => {
          element.id = provider + " " + element.id;
          element.provider = provider;
          element.type = this.state.currentGifType;
      });
      return gifs_array
  }

  interleaveGifArrays = (tenor_array, giphy_array) => {
      if (tenor_array.length == 0) {return giphy_array}
      if (giphy_array.length == 0) {return tenor_array}

      var result = [];
      var i, l = Math.min(tenor_array.length, giphy_array.length);
      
      for (i = 0; i < l; i++) {
          result.push(tenor_array[i], giphy_array[i]);
      }
      result.push(...tenor_array.slice(l), ...giphy_array.slice(l));
      return result
  }

  onSearchTermChanged = (new_search_term) => {
      this.setState({search_term: new_search_term, offset: 0, gifs: [], tenorGifs: [], giphyGifs: [], next: 0}, () => {
          this.refreshGifs()
      })
  }

  showGifsButtonPressed = () => {
      if (this.state.currentGifType != gif_types.GIF) {
          this.setState({currentGifType: gif_types.GIF, currentProvider: this.provider, offset: 0, gifs: [], tenorGifs: [], giphyGifs: [], next: 0}, () => {
              this.refreshGifs()
          })
      }
  }

  showStickersButtonPressed = () => {
      if (this.state.currentGifType != gif_types.STICKER) {
          this.setState({currentGifType: gif_types.STICKER, currentProvider: providers.GIPHY, offset: 0, gifs: [], tenorGifs: [], giphyGifs: [], next: 0}, () => {
              this.refreshGifs()
          })
      }
  }

  loadMoreGifs = () => {
      if (this.state.offset < this.maxGifsToLoad && !this.state.gifsOver) {
          this.refreshGifs()
      }
  }

  handleBackButtonClick = () => {
      var wasVisible = this.props.visible;
      this.props.onBackPressed()
      return wasVisible
  }

  componentDidMount() {
      this.refreshGifs()
      if (this.props.onBackPressed != null){
          BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
      if (this.numColumns > 1) {   
          Dimensions.addEventListener('change', () => {
              this.setState({gifSize: Dimensions.get('window').width / this.numColumns - 15})
          })     
      }
  }
  
  componentWillUnmount() {
      if (this.props.onBackPressed != null){
          BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
  }

  render() {
    return (
      this.props.visible == null || this.props.visible ?
      (          
        <View style={[this.styles.view, this.props.style]}>

          <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextInput
              placeholder={this.state.currentGifType == gif_types.GIF ? (this.placeholderText) : (this.stickersPlaceholderText)}
              placeholderTextColor={this.placeholderTextColor}
              autoCapitalize={'none'}
              numberOfLines={1}
              style={[this.styles.textInput, this.props.textInputStyle]}
              onChangeText={this.onSearchTermChanged}
              value={this.state.search_term}
              {...this.props.textInputProps}
            />
            {this.providerLogo != null ?
            (
                <Image 
                  source={this.providerLogo} 
                  style={[this.styles.providerLogo, this.props.providerLogoStyle]}
                />
            )
            :
            (null)
            }
          </View>
          { 
            this.gifType == gif_types.ALL ?
            (
            <View style={{flexDirection:'row', alignItems:'center', marginTop: 5, marginBottom:15}}>
                
                <TouchableOpacity
                    style={this.state.currentGifType != gif_types.GIF ? ([this.styles.gifTypeButton, this.props.showGifsButtonStyle])
                          : ([this.styles.gifTypeButton, this.props.showGifsButtonStyle, this.styles.gifTypeButtonSelected, this.props.showGifsButtonSelectedStyle])}
                    onPress={this.showGifsButtonPressed}
                >
                    <Text style={this.state.currentGifType != gif_types.GIF ? ([this.styles.gifTypeButtonText, this.props.showGifsButtonTextStyle])
                          : ([this.styles.gifTypeButtonText, this.props.showGifsButtonTextStyle, this.styles.gifTypeButtonSelectedText, this.props.showGifsButtonSelectedTextStyle])}
                    >
                        {this.showGifsButtonText}
                    </Text>
                </TouchableOpacity>
               
                <TouchableOpacity
                    style={this.state.currentGifType != gif_types.STICKER ? ([this.styles.gifTypeButton, this.styles.stickerTypeButton, this.props.showStickersButtonStyle])
                          : ([this.styles.gifTypeButton, this.styles.stickerTypeButton, this.props.showStickersButtonStyle, this.styles.gifTypeButtonSelected, this.props.showStickersButtonSelectedStyle])}
                    onPress={this.showStickersButtonPressed}
                >
                    <Text style={this.state.currentGifType != gif_types.STICKER ? ([this.styles.gifTypeButtonText, this.props.showStickersButtonTextStyle])
                          : ([this.styles.gifTypeButtonText, this.props.showStickersButtonTextStyle, this.styles.gifTypeButtonSelectedText, this.props.showStickersButtonSelectedTextStyle])}
                    >
                        {this.showStickersButtonText}
                    </Text>
                </TouchableOpacity>

            </View>
          )
          :
          (null)
          }
          <FlatList
            onEndReached={this.loadMoreGifs}
            onEndReachedThreshold={0.8}
            onScroll={this.handleScroll}
            keyboardShouldPersistTaps={"handled"}
            style={[this.styles.gifList, this.props.gifListStyle]}
            contentContainerStyle={{alignItems: 'center'}}
            data={this.state.gifs}
            horizontal={this.horizontal}
            numColumns={this.numColumns}
            showsHorizontalScrollIndicator={this.showScrollBar}
            showsVerticalScrollIndicator={this.showScrollBar}
            {...this.props.gifListProps}
            renderItem={({item, index}) => {

              var aspect_ratio = null;
              var gif_preview = null;
              var gif_better_quality = null;

              if (item.provider == providers.TENOR) {
                gif_preview = item.media[0].nanogif.url
                gif_better_quality = item.media[0].tinygif.url
                if (parseInt(item.media[0].tinygif.dims[1])) {
                    aspect_ratio = parseInt(item.media[0].tinygif.dims[0])/parseInt(item.media[0].tinygif.dims[1])
                }
              } else {
                gif_preview = item.images.preview_gif.url
                gif_better_quality = item.images.downsized.url
                if (parseInt(item.images.preview_gif.height)) {
                    aspect_ratio = parseInt(item.images.preview_gif.width)/parseInt(item.images.preview_gif.height)
                }
              }

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {this.props.onGifSelected(gif_better_quality, item); Keyboard.dismiss()}}
                  onLongPress={() => {this.props.onGifLongPress(gif_better_quality, item); Keyboard.dismiss()}}
                  onLongPress={() => {if (this.props.onGifLongPress) {this.props.onGifLongPress(gif_better_quality, item)}}}>
                    
                  <Image
                    resizeMode={'cover'}
                    style={[this.styles.image, !this.horizontal && (index+1)%this.numColumns === 0 ? this.styles.lastColumnImage : {}, this.numColumns > 1 ? {width:this.state.gifSize, minHeight: this.state.gifSize, maxHeight:this.state.gifSize} : {aspectRatio: aspect_ratio ? aspect_ratio : 4/3, height: 150}, this.props.gifStyle]}
                    source={{uri: gif_preview}}
                  />
                </TouchableOpacity>
              )
            }}
            ListFooterComponent={(
              this.state.offset < this.maxGifsToLoad && !this.state.gifsOver?
              (
                <View style={{ justifyContent:'center', width: 150, height: 150}}>
                    <ActivityIndicator size="large" color={this.loadingSpinnerColor} />
                </View>
              )
              :
              (this.state.noGifsFound?
                (
                  <View style={{ justifyContent:'center', width: Dimensions.get('window').width*0.7}}>
                      <Text style={[{textAlign: 'center', fontSize: 20, color: 'grey'}, this.props.noGifsFoundTextStyle]}>{this.noGifsFoundText}</Text>
                  </View>
                )
                :
                (null)
              )
            )}
          />
        </View>
      )
      :
      (null)
    );
  }


  styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 10,
    },
    textInput: {
        flex: 1,
        height: 50,
        fontSize: 20,
        marginHorizontal: 10,
        color: 'white'
    },
    image: {
        borderWidth: 3,
        marginRight: 10,
        marginBottom: 10
    },
    lastColumnImage: {
        marginRight: 0,
    },
    gifList: {
        height: 160,
        marginBottom: 10,
    },
    gifTypeButton: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "black",
        borderRadius: 15,
        padding: 6,
        marginRight: 2,
        borderColor: "black",
        borderWidth: 2
    },
    stickerTypeButton: {
        marginRight: 0,
        marginLeft: 2
    },
    gifTypeButtonSelected: {
        borderColor: "white",
        borderWidth: 2
    },
    gifTypeButtonText: {
        fontSize: 14,
        color: "#e3e3e3"
    },
    gifTypeButtonSelectedText: {
        fontWeight: "bold",
    },
    providerLogo: {
        width: '35%',
        height: 50,
        resizeMode: 'contain'
    }
  });

}

export default GifSearch;
