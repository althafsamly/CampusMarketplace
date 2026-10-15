import { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme } from "../theme";
import { Conversation, Message } from "../types";

export function ChatModal({
  conversation,
  visible,
  onClose,
  onSendMessage,
}: {
  conversation: Conversation | null;
  visible: boolean;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 50);
    }
  }, [conversation]);

  if (!conversation) return null;

  const quickReplies = [
    "Is this still available?",
    "Can you do a quick campus meetup?",
    "Where is the best spot to meet?",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMessage: Message = {
      id: "msg-" + Date.now(),
      senderId: "user",
      senderName: "You",
      text: text.trim(),
      timestamp: "Just now",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    onSendMessage(conversation.id, text.trim());
    setInput("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate smart auto-reply from seller after 1.5s
    setTimeout(() => {
      const sellerReply: Message = {
        id: "msg-" + (Date.now() + 1),
        senderId: "seller",
        senderName: conversation.partnerName,
        text: `Hey! Thanks for reaching out about the ${conversation.itemTitle.split(" ")[0]}. I'm free between classes today near the Student Union!`,
        timestamp: "Just now",
        isMe: false,
      };
      setMessages((prev) => [...prev, sellerReply]);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOuter}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onClose}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>

          <View style={styles.headerProfile}>
            <Image
              source={{ uri: conversation.partnerAvatar }}
              style={styles.headerAvatar}
            />
            <View>
              <View style={styles.headerNameRow}>
                <Text style={styles.headerName}>{conversation.partnerName}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedCheck}>✓</Text>
                </View>
              </View>
              <Text style={styles.headerStatus}>
                📍 {conversation.partnerCampus} · Active now
              </Text>
            </View>
          </View>
        </View>

        {/* Item context banner */}
        <View style={styles.itemBanner}>
          <Image
            source={{ uri: conversation.itemImage }}
            style={styles.itemThumbnail}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {conversation.itemTitle}
            </Text>
            <Text style={styles.itemPrice}>${conversation.itemPrice}</Text>
          </View>
          <View style={styles.safetyTag}>
            <Text style={styles.safetyTagText}>🛡️ Campus Safe Meetup</Text>
          </View>
        </View>

        {/* Messages scroll area */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.isMe ? styles.messageRowMe : styles.messageRowOther,
              ]}
            >
              {!msg.isMe && (
                <Image
                  source={{ uri: conversation.partnerAvatar }}
                  style={styles.bubbleAvatar}
                />
              )}
              <View
                style={[
                  styles.bubble,
                  msg.isMe ? styles.bubbleMe : styles.bubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.bubbleTime,
                    msg.isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick reply chips */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickReplies.map((reply, i) => (
              <Pressable
                key={i}
                style={styles.quickChip}
                onPress={() => handleSend(reply)}
              >
                <Text style={styles.quickChipText}>{reply}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={`Message ${conversation.partnerName}...`}
            placeholderTextColor={theme.colors.textMuted}
            onSubmitEditing={() => handleSend()}
          />
          <Pressable
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            disabled={!input.trim()}
            onPress={() => handleSend()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </Pressable>
        </View>
      </View>
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedCheck: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  headerStatus: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  itemBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    gap: 10,
  },
  itemThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "900",
    color: theme.colors.primary,
    marginTop: 2,
  },
  safetyTag: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.xs,
  },
  safetyTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.primaryLight,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
  },
  bubbleTextMe: {
    color: "#FFFFFF",
  },
  bubbleTextOther: {
    color: theme.colors.textPrimary,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeMe: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  bubbleTimeOther: {
    color: theme.colors.textMuted,
  },
  quickRepliesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryMuted,
    marginRight: 8,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: theme.colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
