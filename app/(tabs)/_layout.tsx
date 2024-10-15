import { Tabs } from "expo-router";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#A0A0A0",
        headerBackground: () => (
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1E1E1E",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "heart"
            | "heart-outline"
            | undefined;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "favorites") {
            iconName = focused ? "heart" : "heart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabel: "Favorites",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
