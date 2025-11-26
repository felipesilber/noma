import React from "react";
import { View, Image } from "react-native";
import styles from "../styles";

const ListCoverImage = ({ items, fallbackImageUrl, style }) => {
    const images = (items || [])
        .map((it) => it.place?.imageUrl)
        .filter(Boolean);
    
    const baseStyle = style || styles.listImage;
    const width = style?.width || 100;
    const height = style?.height || 100;
    const borderRadius = style?.borderRadius || 12;
    
    if (!images.length && !fallbackImageUrl) {
        return <View style={baseStyle}/>;
    }
    if (!images.length && fallbackImageUrl) {
        return (<Image source={{ uri: fallbackImageUrl }} style={baseStyle} resizeMode="cover"/>);
    }
    const [first, second, third] = images;
    if (images.length === 1 || !second) {
        return (<Image source={{ uri: first }} style={baseStyle} resizeMode="cover"/>);
    }
    if (images.length === 2 || !third) {
        return (<View style={[baseStyle, { overflow: "hidden" }]}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image source={{ uri: first }} style={{ flex: 1, marginRight: 1, borderRadius: 0 }} resizeMode="cover"/>
          <Image source={{ uri: second }} style={{ flex: 1, marginLeft: 1, borderRadius: 0 }} resizeMode="cover"/>
        </View>
      </View>);
    }
    return (<View style={[baseStyle, { overflow: "hidden" }]}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 1, flexDirection: "column" }}>
          <Image source={{ uri: first }} style={{ flex: 1, marginBottom: 1, borderRadius: 0 }} resizeMode="cover"/>
          <Image source={{ uri: second }} style={{ flex: 1, marginTop: 1, borderRadius: 0 }} resizeMode="cover"/>
        </View>
        <View style={{ flex: 1, marginLeft: 1 }}>
          <Image source={{ uri: third }} style={{ flex: 1, borderRadius: 0 }} resizeMode="cover"/>
        </View>
      </View>
    </View>);
};

export default ListCoverImage;

