import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import firebase from "../firebase"; // Import your Firebase configuration
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const db = getFirestore(firebase);
    console.log(db);
    async function getCities(db) {
      const beersCol = collection(db, 'beer-volume');
      const beerSnapshot = await getDocs(beersCol);
      const beerList = beerSnapshot.docs.map(doc => doc.data());
      console.log(beerList)
      // return cityList;
    }
    getCities(db);

    
  }, []);

  // const database = getDatabase(app);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Hello World</div>
    </main>
  );
}

export const useClient = true;