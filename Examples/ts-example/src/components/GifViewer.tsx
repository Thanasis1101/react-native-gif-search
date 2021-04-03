import React from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

interface GifViewerProps {
  gifUrl?: string;
}

const GifViewer = ({gifUrl}: GifViewerProps) => {
  return <Image source={{uri: gifUrl}} style={styles.gifImage} />;
};

export default GifViewer;

const styles = StyleSheet.create({
  gifImage: {
    width: WINDOW_WIDTH - 20,
    aspectRatio: 1,
    alignSelf: 'center',
  },
});
