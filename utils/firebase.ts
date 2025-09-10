import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { initializeApp, getApps } from "firebase/app";
import { UserProfile } from "@auth0/nextjs-auth0";

// Initialize Firebase app
if(getApps().length === 0){
  initializeApp(firebaseConfig)
}

const db = getFirestore();
const fbUsersRef = collection(db, "users");
const fbPaymentRef = collection(db, "payments");
const fbAuctionBidsRef = collection(db, "auctionBids");

// Types
export type FbUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: "Male" | "Female" | "";
  walletBalance: number;
  gameWalletBalance: number;
  attemptsBalance: number,
  lossAttempts: number;
  country: string;
  phone: string;
  state: string,
  city: string,
  address1: string;
  address2: string;
};

type Auth0User = {
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
  nickname: string;
};

type Transaction = {
  reference: string;
};

export interface BidData {
  userName: string;
  userEmail: string; // Added username field
  slot: number;
  bidAmount: number;
  createdAt: Timestamp; // Firestore's Timestamp type
}

const useAppAuth = () => {
  // Function for finding a user by email
  const findUserByEmail = async (email: string): Promise<FbUser | null> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        let userData: FbUser | null = null;
        querySnapshot.forEach((doc) => {
          userData = { ...doc.data(), id: doc.id } as FbUser;
        });
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  };


  // Function for storing user to Firebase
  const storeUserToFirebase = async (user: Auth0User) => {
    if (user) {
      const userFromFirebase = await findUserByEmail(user.email);
      if (!userFromFirebase){
        const newUser = await createNewUserInFirebase(user);
        localStorage.setItem("user", JSON.stringify(newUser));
        return;
      } else {
        const existingUserDoc = userFromFirebase;
        localStorage.setItem("user", JSON.stringify(existingUserDoc));
        return;
      }
    }
  };
  const getUserFromLocalStorage = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString;
    } catch (error) {
      console.error("Error retrieving user from local storage:", error);
      return null;
    }
  };
  // Helper function to save new payment reference in Firebase
  const saveNewPaymentRefInFirebase = async (
    email: string,
    reference: string,
    amount: number
  ) => {
    await addDoc(fbPaymentRef, {
      email,
      reference,
      amount,
    });
  };

  // Helper function for placing or changing bids
  const handleBidPlacements = async (user: UserProfile, slot:number, bidAmount: number, currentAuctionBalance: number, previousBid: number|null) => {

  if (!user) {
    return "Unauthenticated!";
  }

  const userName = user.name
  const userEmail = user.email

  try {
    // Query Firestore to check if the user has already placed a bid
    const existingBidQuery = query(fbAuctionBidsRef, where("userEmail", "==", userEmail), where("slot", "==", slot));
    const existingBidSnapshot = await getDocs(existingBidQuery);

    if (!existingBidSnapshot.empty) {
      const existingBidDoc = existingBidSnapshot.docs[0];
      const existingBidId = existingBidDoc.id;

      // Update the existing bid with the new bid amount
      const bidDocRef = doc(db, "auctionBids", existingBidId);
      await updateDoc(bidDocRef, {
        bidAmount: bidAmount, // Overwrite the existing bid amount
        updatedAt: Timestamp.now(),
      });

      // Since bids can only increase and not reduce,
      // Find the difference between new bid and previous bid
      const difference = bidAmount - (previousBid ?? 0)

      // Deduct difference from Auction balance
      const newBalance = currentAuctionBalance - difference
      
      // Debit auction wallet
      updateFieldsInFirebase(user.email, {'gameWalletBalance': newBalance})

      return "Bid updated";
    } else {
      // If no bid exists, create a new one
      await addDoc(fbAuctionBidsRef, {
        userEmail,
        userName,
        slot,
        bidAmount,
        createdAt: Timestamp.now(),
      });

      return "Bid placed";
    }
  } catch (error) {
    return "Failed to process bid";
  }
  }

  // Helper function to get all bids for the auction bids list
  function getAllBids(setBids: (bids: BidData[]) => void) {
    try {
      const bidRef = collection(db, "auctionBids");
  
      const bidsQuery = query(
        bidRef,
        orderBy("bidAmount", "desc"),
        orderBy("createdAt", "asc")
      );
  
      // Real-time snapshot listener
      const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
        const bids = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            userName: data.userName,
            userEmail: data.userEmail,
            slot: data.slot,
            bidAmount: data.bidAmount,
            createdAt: data.createdAt.toDate(), // Convert Firestore timestamp to JS Date
          };
        });
        console.log(bids)
        setBids(bids);
      });
  
      return unsubscribe; // Immediately return the unsubscribe function
    } catch (error) {
      console.error("Error fetching real-time bids: ", error);
      throw new Error("Failed to fetch bids");
    }
  }

  // Helper function to create a new user in Firebase
  const createNewUserInFirebase = async (user: Auth0User) => {
    const newUserRef = await addDoc(fbUsersRef, {
      firstName: user.given_name?user.given_name: '',
      lastName: user.family_name? user.family_name: '',
      email: user.email,
      dob: "",
      gender: "",
      walletBalance: 0,
      gameWalletBalance: 0,
      attemptsBalance: 0,
      lossAttempts: 0,
      sub: user.sub,
      nickname: user.nickname,
      phone: "",
      country: "",
      state: "",
      city: "",
      address1: "",
      address2: "",
    });
    const newUserSnapshot = await getDoc(newUserRef);
    return newUserSnapshot.data();
  };

  async function getDocumentIdByEmail(email: string) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      } else {
        console.error("No document found with the provided email.");
        return null;
      }
    } catch (error) {
      console.error("Error getting document ID from Firebase:", error);
      return null;
    }
  }

  async function updateFieldsInFirebase(
    userEmail: string|null|undefined,
    fieldsToUpdate: Partial<FbUser>
  ) {
    if(!userEmail) return

    const documentId = (await getDocumentIdByEmail(userEmail)) as string;
    const filteredProfile: Partial<FbUser> = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
    );
    try {
      const docRef = doc(db, "users", documentId);
      const existingUserData = (await getDoc(docRef)).data() as FbUser;
      const updatedUserData = { ...existingUserData, ...filteredProfile };
      await updateDoc(docRef, updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      return true; // Return true to indicate successful update
    } catch (error) {
      console.error("Error updating document in Firebase:", error);
      return false; // Return false to indicate error in update
    }
  }

  return {
    storeUserToFirebase,
    getUserFromLocalStorage,
    updateFieldsInFirebase,
    saveNewPaymentRefInFirebase,
    handleBidPlacements,
    getAllBids,
  };
};

export default useAppAuth;
