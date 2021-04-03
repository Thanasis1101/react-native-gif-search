/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import GiphyPicker from './src/components/GifPicker';
import GifViewer from './src/components/GifViewer';

import Header from './src/components/Header';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [gifSelected, setGifSelected] = useState<string>();

  const handleOpenModal = useCallback(() => {
    setModalOpened(!modalOpened);
  }, [modalOpened]);

  const handleSelectModal = useCallback((gifUrl?: string) => {
    setGifSelected(gifUrl);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Open Gif Modal">
            By clicking{' '}
            <Text style={styles.highlight} onPress={handleOpenModal}>
              here
            </Text>{' '}
            you can select a GIF.
          </Section>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleOpenModal}>
            <Text style={styles.buttonLabel}>Select a GIF</Text>
          </TouchableOpacity>
          <GifViewer gifUrl={gifSelected} />
        </View>
      </ScrollView>
      <GiphyPicker
        showModal={modalOpened}
        handleChangeModal={handleOpenModal}
        selectGif={handleSelectModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    backgroundColor: Colors.primary,
    width: '80%',
    padding: 5,
    height: 50,
    alignItems: 'center',
    margin: 20,
    alignSelf: 'center',
    borderRadius: 50 / 2,
    justifyContent: 'center',
  },
  buttonLabel: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default App;
