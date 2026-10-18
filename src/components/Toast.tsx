import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";

export type ToastMessage = {
  id: string;
  type?: "success" | "info" | "remove";
  icon?: string;
  title: string;
  actionText?: string;
  onAction?: () => void;
};

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage | null;
  onDismiss: () => void;
}) {
  const translateY = useRef(new Animated.Value(60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 70,
          friction: 9,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismiss();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(60);
      opacity.setValue(0);
    }
  }, [toast]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 40,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!toast) return null;

  const isRemove = toast.type === "remove";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.card, isRemove && styles.cardRemove]}>
        <View style={styles.content}>
          <Text style={styles.icon}>{toast.icon || (isRemove ? "💔" : "❤️")}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {toast.title}
          </Text>
        </View>

        {toast.actionText && toast.onAction && (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionPressed,
            ]}
            onPress={() => {
              toast.onAction?.();
              dismiss();
            }}
          >
            <Text style={styles.actionText}>{toast.actionText}</Text>
          </Pressable>
        )}

        <Pressable style={styles.closeButton} onPress={dismiss}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 86,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    width: "100%",
    maxWidth: 420,
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cardRemove: {
    backgroundColor: "#1F2937",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    marginRight: 6,
  },
  actionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  closeButton: {
    padding: 4,
    marginLeft: 2,
  },
  closeIcon: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "700",
  },
});
