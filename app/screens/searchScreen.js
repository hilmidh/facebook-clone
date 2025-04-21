import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const SEARCH = gql`
query SearchUser($search: SearchInput) {
  searchUser(search: $search) {
    _id
    email
    name
    password
    username
  }
}
`

export default function SearchUser() {
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [results, setResults] = useState([]); // State for search results (placeholder)
  const { data, loading, error } = useQuery(SEARCH, {variables: {
    search: {
      keyword: searchQuery
    }
  }});

  const handleSearch = () => {
    // console.log(data)
    if(searchQuery.length === 0){
      setResults([])
      return
    }
    setResults(data.searchUser);
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity style={styles.resultCard}>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", // Default Facebook-like avatar
        }}
        style={styles.avatar}
      />
      <Text style={styles.resultText}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch} // Trigger search on "Enter" or "Done"
      />

      {/* Search Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderResult}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <Text style={styles.placeholderText}>No results found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Facebook-like background
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  resultsList: {
    paddingTop: 10,
  },
  resultCard: {
    flexDirection: "row", // Align avatar and text horizontally
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15, // Add spacing between avatar and text
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});