import './Homepage.css';
import firebaseApp from "../Firebase";
import { getAuth, signOut} from "firebase/auth";
import { getFirestore, addDoc, collection} from "firebase/firestore";

const db = getFirestore();
const auth = getAuth(firebaseApp);

const Homepage = () => {
  const logOut = async () => {
    await signOut(auth);
  }
  return (
    <main className="homepage">
      <button onClick={logOut} >Log Out</button>
    </main>
  )
}

export default Homepage;