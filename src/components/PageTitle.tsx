import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export function PageTitle({
  title,
  subtitle,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? <View>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
