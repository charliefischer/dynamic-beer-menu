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

export default function Home() {
  const [data, setData] = useState<BeerData[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

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
      setLoading(false);
    }
    getCities(db);
  }, []);

  const KEG_PRICE = 200;
  const PINTS_PER_KEG = 55;
  const [volume, setVolume] = useState<Number>(0);
  const calculatePint = (vol: Number, minPrice = 5, maxPrice = 10) => {
    if(!volume) return "Sold Out";
    return (maxPrice - minPrice) * (1 - vol / 100) + minPrice;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <NumberOfPeople />
          {data.map((beerData) => {
            return (
              <div key={beerData.beer}>
                <div>Beer: {beerData.beer}</div>
                <div>Beer Left: {volume.toString()}% <input type="range" onChange={(e) => setVolume(e.target.value)} /></div>
                <div>
                  Cost per pint:{" "}
                  {calculatePint(volume, 3, 12)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

// goal - keep pubs busy at all times
// delivery is every tuesday
// meaning monday is the most expensive day
// price raises up to 10% for friday and saturday night and sunday lunch
// price drops when less punters and more beer
