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
  Text
} from 'react-native';

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
        scrollOffset: 0,
        fetching: false,
        gifsOver: false,
        noGifsFound: false,
      }

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
      this.darkGiphyLogo = false;
      if (props.darkGiphyLogo != null) {
          this.darkGiphyLogo = props.darkGiphyLogo;
      }
      this.developmentMode = true;
      if (props.developmentMode != null) {
          this.developmentMode = props.developmentMode;
      }
      this.loadingSpinnerColor = 'white';
      if (props.loadingSpinnerColor != null) {
          this.loadingSpinnerColor = props.loadingSpinnerColor;
      }
      this.showScrollBar = true;
      if (props.showScrollBar != null) {
          this.showScrollBar = props.showScrollBar;
      }
      this.placeholderText = "Search GIF";
      if (props.placeholderText != null) {
          this.placeholderText = props.placeholderText;
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
          this.state.gifSize = Dimensions.get('window').width / this.numColumns - 20;
      }
      

  }

  fetchGifs = () => {
      if (this.state.fetching){
        return
      }
      this.setState({fetching: true, gifsOver: false})
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
              let responseUnique = responseJSON.data.filter((obj1, index1) => {return !responseJSON.data.some((obj2, index2) => obj1.id === obj2.id && index1 != index2)}); // remove duplicates
              let newGifsUnique = responseUnique.filter(o1 => {return !this.state.gifs.some(o2 => o1.id === o2.id)}); // remove duplicates with previous gifs
              this.setState({ gifs: [...this.state.gifs, ...newGifsUnique],
                              offset: this.state.offset + this.gifsToLoad,
                              fetching: false})
          } else {
              this.setState({fetching: false, gifsOver: true, noGifsFound: this.state.gifs.length == 0})
          }
      }).catch((error) => {
        this.setState({fetching: false, gifsOver: true})
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
              let responseUnique = responseJSON.data.filter((obj1, index1) => {return !responseJSON.data.some((obj2, index2) => obj1.id === obj2.id && index1 != index2)}); // remove duplicates
              let newGifsUnique = responseUnique.filter(o1 => {return !this.state.gifs.some(o2 => o1.id === o2.id)}); // remove duplicates with previous gifs
              this.setState({ gifs: [...this.state.gifs, ...newGifsUnique],
                              offset: this.state.offset + this.gifsToLoad,
                              fetching: false})
          } else {
              this.setState({fetching: false, gifsOver: true, noGifsFound: this.state.gifs.length == 0})
          }       
      }).catch((error) => {
          this.setState({fetching: false, gifsOver: true})
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
      if (this.state.offset < this.maxGifsToLoad && !this.state.gifsOver) {
          this.fetchGifs()
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
      if (this.numColumns > 1) {   
          Dimensions.addEventListener('change', () => {
              this.setState({gifSize: Dimensions.get('window').width / this.numColumns - 20})
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

          <View style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              placeholder={this.placeholderText}
              placeholderTextColor={this.placeholderTextColor}
              autoCapitalize='none'
              style={[this.styles.textInput, {width: this.developmentMode ? '100%' : '60%'}, this.props.textInputStyle]}
              onChangeText={this.onSearchTermChanged}
              {...this.props.textInputProps}
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
            onEndReachedThreshold={0.98}
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
            renderItem={({item}) => {
              var aspectRatio = null;
              if (parseInt(item.images.preview_gif.height)) {
                  aspectRatio = parseInt(item.images.preview_gif.width)/parseInt(item.images.preview_gif.height)
              }
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {this.props.onGifSelected(item.images.downsized.url, item); Keyboard.dismiss()}}
                  onLongPress={() => {if (this.props.onGifLongPress) {this.props.onGifLongPress(item.images.downsized.url, item)}}}>
                    
                  <Image
                    resizeMode={'cover'}
                    style={[this.styles.image, this.numColumns > 1 ? {width:this.state.gifSize, minHeight: this.state.gifSize, maxHeight:this.state.gifSize} : {aspectRatio: aspectRatio ? aspectRatio : 4/3, height: 150}, this.props.gifStyle]}
                    source={{uri: item.images.preview_gif.url}}
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
      height: 50,
      fontSize: 20,
      paddingLeft: 10,
      color: 'white'
    },
    image: {
      borderWidth: 3,
      marginRight: 10,
      marginBottom: 10
    },
    gifList: {
      height: 160,
      margin: 5, 
      marginBottom: 10,
    },
  });

}

export default GifSearch;

