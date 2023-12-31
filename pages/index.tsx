import { useEffect, useState } from "react";
import firebase from "../firebase";

import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore/lite";

import NumberOfPeople from "@/components/numberOfPeople";
import DayOfTheWeek from "@/components/dayOfTheWeek";

type BeerData = {
  beer: string;
  volume: string;
};

const DAYS_OF_WEEK = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
export default function Home() {
  const [data, setData] = useState<BeerData[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [count, setCount] = useState<number>(50);
  const [db, setDb] = useState<any>(null);

  const writeToFirestore = async (path, id, data) => {
    const doc1 = doc(db, id, path);
    console.log(doc1);
    try {
      await setDoc(doc1, data);
      console.log("Data written to Firestore successfully.");
    } catch (error) {
      console.error("Error writing data to Firestore:", error);
    }
  };

  useEffect(() => {
    setDb(firebase);
  }, []);

  useEffect(() => {
    if (!db) return;

    async function getCities(db: any) {
      const beersCol = collection(db, "beer-volume");
      const q = query(beersCol);
      const beerSnapshot = await getDocs(q);
      const beerList: BeerData[] = beerSnapshot.docs.map(
        (doc) => doc.data() as BeerData
      );
      setData(beerList);
      setVolume(parseInt(beerList[0].volume));
      setLoading(false);
    }

    getCities(db);
  }, [db]);

  const KEG_PRICE = 200;
  const PINTS_PER_KEG = 1000;
  const [day, setDay] = useState<number>(2);
  const [volume, setVolume] = useState<number>(0);
  const calculatePint = (
    vol: number,
    day: number,
    minPrice = 5,
    maxPrice = 10
  ) => {
    if (!volume) return "Sold Out";
    let priceMultiplier = 1;
    let basePrice = (maxPrice - minPrice) * (1 - vol / 100) + minPrice;
    if (day >= 4 && day < 6) {
      priceMultiplier *= 1.15;
    }
    if (day === 0 || day === 6) {
      priceMultiplier *= 0.9;
    }
    if (count > 250) {
      priceMultiplier *= 1.1;
    }
    return (basePrice * priceMultiplier).toFixed(2);
  };

  const delivery = () => {
    writeToFirestore("3HpH4K7rsEbN3VqZm1P4", "beer-volume", { volume: 100 });
  };

  const drink = () => {
    const pintsRemaining = PINTS_PER_KEG * (volume / 100);
    const afterDrunk = pintsRemaining - count;
    const newVol =
      afterDrunk / PINTS_PER_KEG < 0
        ? 0
        : Math.round((afterDrunk / PINTS_PER_KEG) * 100);
    writeToFirestore("3HpH4K7rsEbN3VqZm1P4", "beer-volume", { volume: newVol });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <NumberOfPeople count={count} setCount={setCount} />
          <DayOfTheWeek days={DAYS_OF_WEEK} day={day} setDay={setDay} />
          {data.map((beerData, i) => {
            return (
              <div key={i}>
                <div>Beer: {beerData.beer}</div>
                <div>
                  Beer Left: {volume.toString()}%{" "}
                  <input
                    type="range"
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    value={volume}
                  />
                </div>
                <div>Cost per pint: £{calculatePint(volume, day, 3, 12)}</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={drink}>Drink</button>
      <button onClick={delivery}>Delivery</button>
    </main>
  );
}

// goal - keep pubs busy at all times
// delivery is every tuesday
// meaning monday is the most expensive day
// price raises up to 10% for friday and saturday night and sunday lunch
// price drops when less punters and more beer
