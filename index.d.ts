declare module 'react-native-gif-search' {
  import React from 'react';
  import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

  enum Providers {
    TENOR = 'tenor',
    GIPHY = 'giphy',
    ALL = 'all',
  }

  enum GifTypes {
    GIF = 'gif',
    STICKER = 'sticker',
    ALL = 'all',
  }

  interface BaseImage {
    url: string;
    width: string;
    height: string;
  }

  type Rating = "y" | "g" | "pg" | "pg-13" | "r";

  type MediaFormats = "low" | "medium" | "high";

  interface GiphyImages {
    fixed_height: BaseImage & {
      size: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
    fixed_height_still: BaseImage;
    fixed_height_downsampled: BaseImage & {
      size: string;
      webp: string;
      webp_size: string;
    };
    fixed_width: BaseImage & {
      size: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
    original_still: BaseImage;
    fixed_width_still: BaseImage;
    fixed_width_downsampled: BaseImage & {
      size: string;
      webp: string;
      webp_size: string;
    };
    fixed_height_small: BaseImage & {
      size: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
    fixed_height_small_still: BaseImage;
    fixed_width_small: BaseImage & {
      size: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
    fixed_width_small_still: BaseImage;
    downsized: BaseImage & {
      size: string;
    };
    downsized_still: BaseImage;
    downsized_large: BaseImage & {
      size: string;
    };
    downsized_medium: BaseImage & {
      size: string;
    };
    downsized_small: BaseImage & {
      size: string;
    };
    original: BaseImage & {
      size: string;
      frames: string;
      mp4: string;
      mp4_size: string;
      webp: string;
      webp_size: string;
    };
    looping: { mp4: string };
    preview: {
      width: string;
      height: string;
      mp4: string;
      mp4_size: string;
    };
    preview_gif: BaseImage & {
      size: string;
    };
  }

  export interface GiphyGIFObject {
    type: string;
    id: string;
    slug: string;
    url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    rating: Rating;
    content_url: string;
    user?: {
      avatar_url: string;
      banner_url: string;
      profile_url: string;
      username: string;
      display_name: string;
      twitter: string;
    };
    source_tld: string;
    source_post_url: string;
    update_datetime: string;
    create_datetime: string;
    import_datetime: string;
    trending_datetime: string;
    title: string;
    images: GiphyImages;
  }

  interface TenorGifFormats {
    gif: string;
    mediumgif: string;
    tinygif: string;
    nanogif: string;
    mp4: string;
    loopedmp4: string;
    tinymp4: string;
    nanomp4: string;
    webm: string;
    tinywebm: string;
    nanowebm: string;
  }

  interface TenorMediaObject {
    preview: string;
    url: string;
    dims: number[];
    size: number;
  }

  export interface TenorGIFObject {
    created: number;
    hasaudio: boolean;
    id: string;
    media: { [key in keyof TenorGifFormats]: keyof TenorMediaObject }[];
    tags: string[];
    title: string;
    itemurl: string;
    hascaption: boolean;
    url: string;
  }

  export interface GifSearchProps {
    visible?: boolean;
    gifsToLoad?: number;
    maxGifsToLoad?: number;
    giphyApiKey?: string;
    tenorApiKey?: string;
    showScrollBar?: boolean;
    stickersPlaceholderText?: string;
    noGifsFoundText?: string;
    horizontal?: boolean;
    numColumns?: number;
    provider?: keyof typeof Providers;
    providerLogo?: string;
    gifType?: keyof typeof GifTypes;
    showGifsButtonText?: string;
    showStickersButtonText?: string;
    placeholderTextColor?: string;
    loadingSpinnerColor?: string;
    previewGifQuality?: MediaFormats;
    selectedGifQuality?: MediaFormats;

    style?: ViewStyle;
    textInputStyle?: TextStyle;
    gifListStyle?: ViewStyle;
    gifStyle?: ViewStyle;
    placeholderText?: string;
    noGifsFoundTextStyle?: TextStyle;

    textInputProps?: TextInputProps;

    onError?: (error: ErrorEvent) => void;
    onGifSelected: (
      gifUrl: string,
      gifObject: GiphyGIFObject | TenorGIFObject
    ) => void;
    onGifLongPress?: (
      gifUrl: string,
      gifObject: GiphyGIFObject | TenorGIFObject
    ) => void;
    onBackPressed?: () => void;
  }

  export const GifSearch: (props: GifSearchProps) => JSX.Element;
}
