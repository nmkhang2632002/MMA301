import { rootPointAPI } from "@/constants/api";
import { Item } from "@/constants/data";
import axios from "axios";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  SectionListData,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ItemModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: string) => void;
  dataChange: SectionListData<Item>;
  refreshData: () => void;
};
const ItemCreateModal = ({
  modalVisible,
  setModalVisible,
  dataChange,
  refreshData,
}: ItemModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    weight: 0,
    rating: "",
    price: 0,
    isTopOfTheWeek: false,
    image: "",
    color: "",
    bonus: "",
    origin: "",
  });
  const coppyData = { ...dataChange, items: [...dataChange.data] };
  const handleAddItem = async () => {
    setIsLoading(true);
    const lastId = coppyData.data[coppyData.data.length - 1].id;
    const firstId = lastId?.substring(0, 2);
    const id = lastId?.substring(2);

    coppyData.items.push({
      ...newItem,
      id: firstId + (parseInt(id) + 1).toString(),
    });
    try {
      const response = await axios.put(
        rootPointAPI + `/menu/${dataChange.id}`,
        coppyData
      );
      if (response.data) {
        refreshData();
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setModalVisible("");
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible("")}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>Add New Orchid</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              value={newItem.weight.toString()}
              onChangeText={(text) =>
                setNewItem({ ...newItem, weight: parseInt(text) })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Rating"
              value={newItem.rating}
              onChangeText={(text) => setNewItem({ ...newItem, rating: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newItem.price.toString()}
              onChangeText={(text) =>
                setNewItem({ ...newItem, price: parseInt(text) })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={newItem.image}
              onChangeText={(text) => setNewItem({ ...newItem, image: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Color"
              value={newItem.color}
              onChangeText={(text) => setNewItem({ ...newItem, color: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Bonus"
              value={newItem.bonus}
              onChangeText={(text) => setNewItem({ ...newItem, bonus: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Origin"
              value={newItem.origin}
              onChangeText={(text) => setNewItem({ ...newItem, origin: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddItem}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "...Loading" : "Add"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible("")}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default ItemCreateModal;
