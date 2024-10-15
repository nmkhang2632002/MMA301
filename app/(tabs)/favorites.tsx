import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<Item[]>([]);

  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(newFavorites);
    AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };
  useFocusEffect(() => {
    const getFavorites = async () => {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites) {
        setFavorites(JSON.parse(favorites));
      }
    };
    getFavorites();
  });
  const renderOrchidItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemOrigin}>{item.origin}</Text>
        <Text style={styles.itemColor}>Color: {item.color}</Text>
        <Text style={styles.itemWeight}>Weight: {item.weight}g</Text>
        <Text style={styles.itemBonus}>Bonus: {item.bonus}</Text>
        <View style={styles.itemDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.itemRating}>{item.rating}</Text>
          </View>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <TouchableOpacity
            onPress={() => removeFromFavorites(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="heart-dislike" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
      {item.isTopOfTheWeek && (
        <View style={styles.topOfWeekBadge}>
          <Text style={styles.topOfWeekText}>Top</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Orchids</Text>
      </View>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderOrchidItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No favorite orchids yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemOrigin: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  itemWeight: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  itemBonus: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  removeButton: {
    padding: 4,
  },
  topOfWeekBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  topOfWeekText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
  },
});
