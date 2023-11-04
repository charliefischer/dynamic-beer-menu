import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import firebase from "../firebase"; // Import your Firebase configuration
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "firebase/firestore/lite";
import NumberOfPeople from "@/components/numberOfPeople";

type BeerData = {
  beer: string;
  volume: string;
};

const DAYS_OF_WEEK = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
export default function Home() {
  const [data, setData] = useState<BeerData[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [count, setCount] = useState(50);

  useEffect(() => {
    const db = getFirestore(firebase);
    console.log(db);
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
  }, []);

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
    if (day >= 4) {
      priceMultiplier = 1.15;
    }
    if (day === 0 || day === 6) {
      priceMultiplier = 0.9;
    }
    return (basePrice * priceMultiplier).toFixed(2);
  };

  const drink = () => {
    const pintsRemaining = PINTS_PER_KEG * (volume / 100);
    console.log(pintsRemaining - count)
    const afterDrunk = pintsRemaining - count
    const newVol = afterDrunk / PINTS_PER_KEG * 100
    if(newVol < 0) {
      setVolume(0)
    } else {
      setVolume(Math.round(newVol));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <NumberOfPeople count={count} setCount={setCount} />
          <select
            onChange={(e) => setDay(parseInt(e.target.value))}
            value={day}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <option value={n} key={n}>
                {DAYS_OF_WEEK[n]}day
              </option>
            ))}
          </select>
          {data.map((beerData) => {
            return (
              <div key={beerData.beer}>
                <div>Beer: {beerData.beer}</div>
                <div>
                  Beer Left: {volume.toString()}%{" "}
                  <input
                    type="range"
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    value={volume}
                  />
                </div>
                <div>Cost per pint: {calculatePint(volume, day, 3, 12)}</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={drink}>Drink</button>
    </main>
  );
}

// goal - keep pubs busy at all times
// delivery is every tuesday
// meaning monday is the most expensive day
// price raises up to 10% for friday and saturday night and sunday lunch
// price drops when less punters and more beer
