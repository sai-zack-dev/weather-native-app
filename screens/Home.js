import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "react-native-heroicons/solid";
import debounce from "lodash/debounce";
import { fetchForecast, fetchLocation } from "../api/weather";
import { weatherImg } from "../constants/index";
import * as Progress from 'react-native-progress';
import { getData, storeData } from "../utils/asyncStorage";

export default function Home() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchForecast({
      city: loc.name,
      days: "7",
    }).then((res) => {
      setWeather(res);
      setLoading(false);
      storeData("city", loc.name)
    });
  };
  const handleSearch = (val) => {
    // fetch location
    if (val.length > 2) {
      fetchLocation({ city: val }).then((res) => {
        setLocations(res);
        setLoading(false);
      });
    }
  };
  useEffect(() => {
    fetchMyWeather();
  }, []);
  const fetchMyWeather = async () => {
    let myCity = await getData("city");
    let CityName = myCity ? myCity : "Singapore";
    fetchForecast({
      city: CityName,
      days: "7",
    }).then((res) => {
      setWeather(res);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View className="flex-1 relarive">
      <StatusBar style="light" />
      <Image
        blurRadius={50}
        source={require("../assets/img/bg10.jpg")}
        className="absolute"
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
            <Progress.CircleSnail thickness={10} size={100} color="white" />
        </View>
      ) : (
        <SafeAreaView className="flex-1 relative">
          {/* Search Section */}
          <View style={{ height: "5%" }} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-2xl"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="SEARCH CITY"
                  placeholderTextColor={"white"}
                  className="pl-6 h-10 p-1 flex-1 text-base text-white"
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-2xl p-3 m-1"
              >
                <MagnifyingGlassIcon size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-16 rounded-2xl">
                {locations.map((loc, idx) => {
                  let showBorder = idx + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={idx}
                      className={
                        "flex-row items-center border-0 p-3 px-4 mb-1 " +
                        borderClass
                      }
                    >
                      <MapPinIcon size={20} color="black" />
                      <Text className="text-black text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* Forcus Section */}
          <View className="mx-4 flex-1 justify-around mb-2">
            {/* Location */}
            <View>
              <Text className="text-gray-300 text-2xl text-center font-semibold">
                {location?.name}
              </Text>
              <Text className="text-white text-4xl text-center font-bold">
                {location?.country}
              </Text>
            </View>
            {/* Weather Image */}
            <Image
              source={weatherImg[current?.condition?.text]}
              className="w-64 h-64 mx-auto"
            />
            {/* Weather Info */}
            <View className="space-y-2">
              <Text className="text-white text-7xl text-center font-bold ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-white text-2xl text-center tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* Other Info */}
            <View className="flex-row gap-3 mr-5">
              <View
                className="flex-row items-center justify-center h-16 rounded-xl w-1/3"
                style={{ backgroundColor: theme.bgWhite(0.2) }}
              >
                <Image
                  source={require("../assets/img/drop.png")}
                  className="h-10 w-10"
                />
                <Text className="text-white text-xl font-semibold ml-3">
                  {current?.humidity}%
                </Text>
              </View>
              <View
                className="flex-row items-center justify-center h-16 rounded-xl w-1/3"
                style={{ backgroundColor: theme.bgWhite(0.2) }}
              >
                <Image
                  source={require("../assets/img/wind.png")}
                  className="h-10 w-10"
                />
                <Text className="text-white text-xl font-semibold ml-3">
                    {current?.wind_mph} mph
                </Text>
              </View>
              <View
                className="flex-row items-center justify-center h-16 rounded-xl w-1/3"
                style={{ backgroundColor: theme.bgWhite(0.2) }}
              >
                <Image
                  source={require("../assets/img/dir.png")}
                  className="h-10 w-10"
                />
                <Text className="text-white text-xl font-semibold ml-3">
                  {current?.wind_dir}
                </Text>
              </View>
            </View>
          </View>
          {/* Next Day Section */}
          <View className="mb-2">
            <View className="flex-row items-center m-5">
              <CalendarDaysIcon size={25} color="white" />
              <Text className="text-white text-lg ml-3">Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, idx) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];

                return (
                  <View
                    key={idx}
                    className="flex justify-center items-center rounded-3xl p-5 mr-4 w-40"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={weatherImg[item?.day?.condition?.text]}
                      className="w-14 h-14 my-3"
                    />
                    <Text className="text-white text-xl">{dayName}</Text>
                    {/* <Text className="text-white text-xl">{item?.day?.condition?.text}</Text> */}
                    <Text className="text-white text-2xl font-semibold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
