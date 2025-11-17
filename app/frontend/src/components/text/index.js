import React from "react";
import { Text, StyleSheet } from "react-native";
const AppText = ({ children, style, weight = "regular", ...props }) => {
    const fontStyle = weight === "bold" ? styles.bold : styles.regular;
    return (<Text {...props} style={[fontStyle, style]}>
      {children}
    </Text>);
};
const styles = StyleSheet.create({
    regular: {
        fontFamily: "Jakarta-Regular",
    },
    bold: {
        fontFamily: "Jakarta-Bold",
    },
});
export default AppText;
