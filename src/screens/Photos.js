import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FlatList,
  StyleSheet,
  Image,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Button,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { getPhotosAPI, clearPhotos } from "../redux/modules/PhotosAPI";
import NetworkUtils from "../utils/networkUtils";

export default Photos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mainImg, setMainImg] = useState(null);
  const [imgLoad, setImgLoad] = useState(false);
  const [page, setPage] = useState(1);
  const flatList = useRef(null);

  const { isLoading, response, error } = useSelector((s) => s.PhotosAPIReducer);
  const dispatch = useDispatch();

  const onRefresh = () => {
    dispatch(clearPhotos());
    setPage(1);
    NetworkUtils.isNetworkAvailable().then((isConnected) => {
      if (isConnected) {
        dispatch(getPhotosAPI(1));
      } else {
        setTimeout(() => {
          alert(
            "It seems some problem in network connectivity. Please try again after some time."
          );
        }, 500);
      }
    });
  };

  const showModal = (item) => {
    setModalVisible(true);
    setMainImg(item.urls.full);
  };

  const hideModal = () => {
    setModalVisible(false);
    setMainImg(null);
  };

  const scrollToEnd = () => {
    flatList.current.scrollToEnd();
  };

  const getNextPage = () => {
    setPage((prev) => prev + 1);
    NetworkUtils.isNetworkAvailable().then((isConnected) => {
      if (isConnected) {
        dispatch(getPhotosAPI(page + 1)).then(() =>
          setTimeout(() => scrollToEnd(), 1500)
        );
      } else {
        setTimeout(() => {
          alert(
            "It seems some problem in network connectivity. Please try again after some time."
          );
        }, 500);
      }
    });
  };

  useEffect(() => {
    if (response === null) {
      NetworkUtils.isNetworkAvailable().then((isConnected) => {
        if (isConnected) {
          dispatch(getPhotosAPI(page));
        } else {
          setTimeout(() => {
            alert(
              "It seems some problem in network connectivity. Please try again after some time."
            );
          }, 500);
        }
      });
    }
    if (error !== null && error.errors) {
      setTimeout(() => {
        alert(error.errors[0]);
      }, 500);
    }
  }, [dispatch, error]);

  const renderPhotosList = ({ item, index }) => (
    <>
      <View style={styles.itemPhoto}>
        <TouchableOpacity
          style={{ width: "90%", height: "85%" }}
          onPress={() => {
            showModal(item);
          }}
        >
          <Image
            style={styles.photoImg}
            source={{ uri: item.urls.regular }}
            resizeMode='cover'
          />
        </TouchableOpacity>
        <Text style={styles.itemText}>Author: {item.user.name}</Text>
        <Text style={styles.itemSubText}>About: {item.alt_description}</Text>
      </View>
      {index === response.length - 1 ? (
        <Button
          title='Get more photos...'
          onPress={getNextPage}
          disabled={isLoading}
          color='#5CB85C'
        />
      ) : (
        <></>
      )}
    </>
  );

  if (response === null) {
    return (
      <ActivityIndicator size='large' color='#5CB85C' animating={isLoading} />
    );
  } else if (error !== null && error.errors) {
    return <Text>{error.errors[0]}</Text>;
  } else {
    return (
      <>
        <View style={styles.container}>
          <StatusBar barStyle={"dark-content"} />
          <Text style={styles.logo}>PhotosPicker</Text>
          <FlatList
            data={response}
            style={styles.listPhotos}
            ref={flatList}
            keyExtractor={(item) => item.id}
            renderItem={renderPhotosList}
            refreshing={false}
            onRefresh={onRefresh}
          />
          {isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              size='large'
              color='#5CB85C'
            />
          ) : (
            <></>
          )}
        </View>
        <Modal animationType='slide' transparent={true} visible={modalVisible}>
          <StatusBar hidden={true} />
          <View style={modalStyles.container}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{ uri: mainImg }}
              resizeMode='contain'
              onLoadStart={() => setImgLoad(true)}
              onLoadEnd={() => setImgLoad(false)}
            />
            <ActivityIndicator
              style={modalStyles.loader}
              size='large'
              color='#5CB85C'
              animating={imgLoad}
            />
            <TouchableOpacity
              style={modalStyles.close}
              onPress={hideModal}
              activeOpacity={1}
            >
              <AntDesign name='closecircleo' size={30} color='white' />
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  listPhotos: {
    width: "100%",
  },
  photoImg: {
    height: "100%",
    width: "100%",
  },
  logo: {
    fontSize: 25,
    fontWeight: "700",
    color: "#5CB85C",
    marginTop: Platform.OS === "android" ? 25 : 5,
    marginBottom: 20,
  },
  itemPhoto: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: 300,
  },
  itemText: {
    fontSize: Platform.OS === "android" ? 12 : 16,
    fontWeight: "400",
    color: "#5CB85C",
  },
  itemSubText: {
    fontSize: Platform.OS === "android" ? 10 : 14,
    fontWeight: "300",
    color: "#5CB85C",
  },
  loader: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  close: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: 15,
    right: 15,
    width: 30,
    height: 30,
  },
  closeText: {
    color: "#fff",
    fontSize: 25,
  },
  loader: {
    position: "absolute",
    top: 15,
    width: "100%",
    height: "100%",
  },
});
