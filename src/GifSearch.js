import React, { PureComponent, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  BackHandler
} from 'react-native';

import {Spinner} from 'native-base'

import Requests from './Requests';

const BASE_URL = 'http://api.giphy.com/v1/gifs/';

class GifSearch extends PureComponent {

	constructor(props) {
      super(props);
      
      this.state = {
        gifs: [],
        offset: 0,
        term: "",
        visible: this.props.visible != null ? this.props.visible : true,
        horizontal: this.props.horizontal != null ? this.props.horizontal : true,
        scrollOffset: 0,
        fetching: false,
      }

      this.gifsToLoad = 15;
      if (props.gifsToLoad != null) {
          this.gifsToLoad = props.gifsToLoad;
      }
      this.maxGifsToLoad = 60;
      if (props.maxGifsToLoad != null) {
          this.maxGifsToLoad = props.maxGifsToLoad;
      }     
      this.textColor = 'white';
      if (props.textColor != null) {
          this.textColor = props.textColor;
      }
      this.placeholderTextColor = 'grey';
      if (props.placeholderTextColor != null) {
          this.placeholderTextColor = props.placeholderTextColor;
      }
      this.giphyApiKey = '';
      if (props.giphyApiKey != null) {
          this.giphyApiKey = props.giphyApiKey;
      }
      this.darkGiphyLogo = false;
      if (props.darkGiphyLogo != null) {
          this.darkGiphyLogo = props.darkGiphyLogo;
      }
      this.closeOnBackPressed = false;
      if (props.closeOnBackPressed != null) {
          this.closeOnBackPressed = props.closeOnBackPressed;
      }
      this.developmentMode = true;
      if (props.developmentMode != null) {
          this.developmentMode = props.developmentMode;
      }
      this.loadingSpinnerColor = 'white';
      if (props.loadingSpinnerColor != null) {
          this.loadingSpinnerColor = props.loadingSpinnerColor;
      }

  }

  fetchGifs = () => {
      if (this.state.fetching){
        return
      }
      this.setState({fetching: true})
      if (this.state.term == ""){
          this.fetchTrendingGifs()
          return
      }
      this.fetchGifsByTerm()
  }

  fetchGifsByTerm = () => {
      Requests.fetch("GET", BASE_URL + "search", {
          "api_key": this.giphyApiKey,
          "q": this.state.term,
          "limit": Math.min(this.gifsToLoad, this.maxGifsToLoad - this.state.offset),
          "offset": this.state.offset
      }). then((responseJSON) => {
          if (responseJSON.data.length > 0){
            this.setState({ gifs: [...new Set([...this.state.gifs, ...responseJSON.data])],
                            offset: this.state.offset + this.gifsToLoad,
                            fetching: false})
          } else {
              this.setState({fetching: false})
          }
      }).catch((error) => {
        this.setState({fetching: false})
        if (this.props.onError) {
          this.props.onError(error)
        }
    })     
  }

  fetchTrendingGifs = () => {
      Requests.fetch("GET", BASE_URL + "trending", {
          "api_key": this.giphyApiKey,
          "limit": Math.min(this.gifsToLoad, this.maxGifsToLoad - this.state.offset),
          "offset": this.state.offset
      }). then((responseJSON) => {
          if (responseJSON.data.length > 0){
            this.setState({ gifs: [...new Set([...this.state.gifs, ...responseJSON.data])],
                            offset: this.state.offset + this.gifsToLoad,
                            fetching: false})
          } else {
              this.setState({fetching: false})
          }       
      }).catch((error) => {
          this.setState({fetching: false})
          if (this.props.onError) {
              this.props.onError(error)
          }
      })
  }

  onSearchTermChanged = (new_term) => {
      this.setState({term: new_term, offset: 0, gifs: []}, () => {
          this.fetchGifs()
      })
  }

  loadMoreGifs = () => {
      if (this.state.offset < this.maxGifsToLoad) {
          this.fetchGifs()
      } else {
          this.setState({scrollSize: this.state.scrollOffset})
      }
  }

  handleBackButtonClick = () => {
      var wasVisible = this.props.visible;
      this.props.onBackPressed()
      return wasVisible
  }

  componentDidMount() {
      this.fetchGifs()
      if (this.props.onBackPressed != null){
          BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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

          <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              placeholder="Αναζήτηση GIF"
              placeholderTextColor={this.placeholderTextColor}
              autoCapitalize='none'
              style={[this.styles.textInput, {width: this.developmentMode ? '100%' : '60%'}, this.props.textInputStyle]}
              onChangeText={this.onSearchTermChanged}
            />
            {!this.developmentMode ?
            (
                <Image 
                  source={this.darkGiphyLogo ? (require('../img/PoweredBy_200px-White_HorizText.png')) : (require('../img/PoweredBy_200px-Black_HorizText.png'))} 
                  style={{width: '40%', height: 50, resizeMode: 'contain'}}
                />
            )
            :
            (null)
            }
          </View>
          <FlatList
            onEndReached={this.loadMoreGifs}
            onEndReachedThreshold={0.95}
            onScroll={this.handleScroll}
            style={[this.styles.gifList, this.props.gifListStyle]}
            data={this.state.gifs}
            horizontal={this.state.horizontal}
            renderItem={({item}) => {
              var aspectRatio = null;
              if (parseInt(item.images.preview_gif.height)) {
                  aspectRatio = parseInt(item.images.preview_gif.width)/parseInt(item.images.preview_gif.height)
              }
              return (
                <TouchableOpacity activeOpacity={0.7} onPress={() => {this.props.onGifSelected(item.images.fixed_width_downsampled.url)}}>
                  <Image
                    resizeMode='contain'
                    style={[this.styles.image, {aspectRatio: aspectRatio}, this.props.gifStyle]}
                    source={{uri: item.images.preview_gif.url}}
                  />
                </TouchableOpacity>
              )
            }}
            ListFooterComponent={(
              this.state.offset < this.maxGifsToLoad && this.state.fetching?
              (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", width: 150}}>
                    <Spinner size="large" color={this.loadingSpinnerColor} />
                </View>
              )
              :
              (null)
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
      borderRadius: 10,
    },
    textInput: {
      height: 50,
      fontSize: 20,
      paddingLeft: 10,
      marginBottom: 10,
    },
    image: {
      height:150,
      marginRight: 20,
      marginBottom: 20,
      borderWidth: 3,
    },
    gifList: {
      height: 130,
      margin: 5, 
    },
  });

}

export default GifSearch;
