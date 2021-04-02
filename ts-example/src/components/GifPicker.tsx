import React, {useCallback} from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import {GifSearch} from 'react-native-gif-search';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const GIPHY_API_KEY = 'NctafbvmG7x6Z1HyDVsd5gvB5SBf87ZE';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

interface GiphyPickerProps {
  showModal: boolean;
  handleChangeModal: () => void;
  selectGif: (gifUrl?: string) => void;
}

const GiphyPicker = ({
  showModal,
  handleChangeModal,
  selectGif,
}: GiphyPickerProps) => {
  const _handleSelectGif = useCallback(
    (gifUrl: string) => {
      selectGif(gifUrl);
      handleChangeModal();
    },
    [handleChangeModal, selectGif],
  );

  return (
    <Modal visible={showModal} animationType={'fade'} transparent>
      <View style={styles.modalDarkBackground} />
      <View style={styles.contentContainer}>
        <GifSearch
          visible
          giphyApiKey={GIPHY_API_KEY}
          gifsToLoad={10}
          maxGifsToLoad={3 * 9}
          style={styles.gifContainer}
          textInputStyle={styles.searchInputText}
          gifListStyle={styles.gifListComponent}
          gifStyle={styles.gifComponent}
          loadingSpinnerColor={'black'}
          placeholderTextColor={'#807E7E'}
          placeholderText={'Search a GIF'}
          horizontal={false}
          numColumns={3}
          onGifSelected={_handleSelectGif}
          showScrollBar={false}
        />
        <TouchableOpacity
          onPress={handleChangeModal}
          style={styles.giphyPickerHeader}>
          <Text style={styles.closeButtonLabel}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GiphyPicker;

const styles = StyleSheet.create({
  modalDarkBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flex: 1,
    paddingTop: WINDOW_HEIGHT / 4,
  },
  giphyPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    top: WINDOW_HEIGHT / 4,
  },
  gifContainer: {
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
  gifListComponent: {
    width: '100%',
    height: 400,
  },
  gifComponent: {
    height: 120,
    width: 120,
    borderWidth: 0,
    borderRadius: 5,
  },
  searchInputText: {
    backgroundColor: '#F4EBEC',
    borderRadius: 5,
    fontSize: 14,
    height: 30,
    lineHeight: 15,
    paddingLeft: 10,
    marginBottom: 10,
    maxWidth: '80%',
    paddingTop: 0,
    paddingBottom: 0,
  },
  closeButtonLabel: {
    color: Colors.dark,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 25,
  },
});
