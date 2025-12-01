import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { ArrowLeft, LogOut, User, Settings, Bell } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profileSection}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png",
          }}
        />
        <Text style={styles.name}>John Mathew</Text>
        <Text style={styles.email}>johnmathew@gmail.com</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <User size={22} color="#FFF" />
          <Text style={styles.menuText}>Account Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={22} color="#FFF" />
          <Text style={styles.menuText}>App Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Bell size={22} color="#FFF" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <LogOut size={22} color="#FF575F" />
          <Text style={[styles.menuText, { color: "#FF575F" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B15" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#181822",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },

  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
  },
  email: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },

  menu: {
    marginTop: 20,
    backgroundColor: "#181822",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#2A2A35",
    paddingHorizontal: 10,
  },
  menuText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
});
