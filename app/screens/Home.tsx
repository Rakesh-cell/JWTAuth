import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../context/AuthContext";

const EmpPic = require("../assets/employeePic.png");
const Home = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setSearch("");
    const loadUsers = async () => {
      try {
        const result = await axios.get(`${API_URL}/users`);
        setUsers(result.data);
        setFilteredData(result.data);
        // console.log(users);
      } catch (e: any) {
        alert(e.message);
      }
    };
    loadUsers();
  }, []);
  const onSearch = (text) => {
    if (text) {
      const newData = users.filter((item) => {
        const itemData = item.email
          ? item.email.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(users);
    }
  };
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={styles.title}>USER LIST</Text>
      <TextInput
        value={search}
        style={styles.search}
        placeholder="Enter Email to Search"
        onChangeText={(text) => {
          setSearch(text);
          onSearch(text);
        }}
      />
      <FlatList
        data={filteredData}
        style={{ marginTop: 10 }}
        renderItem={({ item, index }) => {
          return <Card key={item._id} id={item._id} email={item.email} />;
        }}
        keyExtractor={(item) => item._id}
        extraData={search}
      />
      {/* {filteredData &&
        filteredData?.map((user) => {
          return <Card key={user._id} id={user._id} email={user.email} />;
        })} */}

      {filteredData.length <= 0 && (
        <ActivityIndicator
          style={{ flex: 1, alignSelf: "center" }}
          size="large"
        />
      )}
    </View>
  );
};

const Card = ({ id, email }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={EmpPic} style={styles.image} />
        <View>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>ID:</Text>
          <Text>{id}</Text>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>Email:</Text>
          <Text>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fee",
    borderWidth: 1,
    borderRadius: 5,
    gap: 3,
    marginVertical: 5,
    padding: 10,
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    borderRadius: 100,
    height: 100,
    width: 100,
  },
  card: {
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "400",
  },
  search: {
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    alignContent: "center",
    padding: 10,
    borderRadius: 10,
  },
});
export default Home;
