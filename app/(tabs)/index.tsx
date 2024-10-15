import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  SectionListData,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { rootPointAPI } from "@/constants/api";
import { Category, Item } from "@/constants/data";
import ItemCreateModal from "@/components/ItemCreateModal";
import ItemUpdateModal from "@/components/ItemUpdateModal";
import ItemDeleteModal from "@/components/ItemDeleteModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState("");
  const [dataChange, setDataChange] = useState<SectionListData<Item> | null>(
    null
  );
  const [idModify, setIdModify] = useState("");
  const [favoritesList, setFavoritesList] = useState<Item[]>([]);

  const isOpenCreateModal = modalVisible === "create-modal";
  const isOpenEditModal = modalVisible === "edit-modal";
  const isOpenDeleteModal = modalVisible === "delete-modal";

  const firstId = idModify.substring(0, 1);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(rootPointAPI + "/menu");
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getFavorites = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      setFavoritesList(JSON.parse(favorites));
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(() => {
    getFavorites();
  });
  const handleDeleteItem = async () => {
    try {
      const deleteItems = categories
        .find((item) => item.id === firstId)
        ?.items.filter((item) => item.id !== idModify);

      const response = await axios.put(rootPointAPI + `/menu/${firstId}`, {
        items: deleteItems,
      });

      if (response.data) {
        getData();
        setModalVisible("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = (item: Item) => {
    const newFavorites = favoritesList?.some(
      (favorite) => favorite.id === item.id
    )
      ? favoritesList?.filter((favorite) => favorite.id !== item.id)
      : [...favoritesList, item];
    setFavoritesList(newFavorites);
    AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orchid Catalog</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={getData} style={styles.iconButton}>
            <Ionicons name="refresh-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      {categories?.length > 0 ? (
        <SectionList
          sections={categories?.map((category: Category) => ({
            ...category,
            data: category.items || [], // Ensure data is always an array
          }))}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <OrchidItem
              item={item}
              setIdChange={setIdModify}
              setModalVisible={setModalVisible}
              isFavorite={
                favoritesList?.some((favorite) => favorite.id === item.id) ??
                false
              }
              toggleFavorite={toggleFavorite}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>{section?.name}</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setModalVisible("create-modal");
                    setDataChange(section);
                  }}
                >
                  <Ionicons name="add-circle" size={24} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No data available</Text>
        </View>
      )}
      {isOpenCreateModal && dataChange && (
        <ItemCreateModal
          modalVisible={isOpenCreateModal}
          setModalVisible={setModalVisible}
          dataChange={dataChange}
          refreshData={getData}
        />
      )}
      {isOpenEditModal && dataChange && (
        <ItemUpdateModal
          modalVisible={isOpenEditModal}
          setModalVisible={setModalVisible}
          categories={categories}
          idItem={idModify}
          refreshData={getData}
        />
      )}
      {isOpenDeleteModal && (
        <ItemDeleteModal
          isVisible={isOpenDeleteModal}
          onClose={setModalVisible}
          handleDeleteItem={handleDeleteItem}
        />
      )}
    </SafeAreaView>
  );
}

type OrchidItemProps = {
  item: Item;
  setModalVisible: (modal: string) => void;
  setIdChange: (data: string) => void;
  isFavorite: boolean;
  toggleFavorite: (item: Item) => void;
};
const OrchidItem = ({
  item,
  setModalVisible,
  setIdChange,
  isFavorite,
  toggleFavorite,
}: OrchidItemProps) => (
  <TouchableOpacity style={styles.itemContainer}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemOrigin}>{item.origin}</Text>
      <View style={styles.itemDetails}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.itemRating}>{item.rating}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#333"}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="trash-outline"
            size={24}
            color="#FF6B6B"
            onPress={() => {
              setModalVisible("delete-modal");
              setIdChange(item.id);
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="create-outline"
            size={24}
            color="#4CAF50"
            onPress={() => {
              setModalVisible("edit-modal");
              setIdChange(item.id);
            }}
          />
        </TouchableOpacity>
      </View>
    </View>

    {item.isTopOfTheWeek && (
      <View style={styles.topOfWeekBadge}>
        <Text style={styles.topOfWeekText}>Top</Text>
      </View>
    )}
  </TouchableOpacity>
);
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
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#F5F5F5",
    padding: 16,
    color: "#333",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemOrigin: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
});
