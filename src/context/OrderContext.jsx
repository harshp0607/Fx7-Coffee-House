import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { showOrderReadyNotification } from "../utils/notifications";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentDrink, setCurrentDrink] = useState(null);
  const [submittedOrders, setSubmittedOrders] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [allCompletedOrders, setAllCompletedOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      setSubmittedOrders(ordersData);

      // Filter for pending donations from active orders
      const activeDonations = ordersData.filter(
        (order) => order.donation > 0
      );
      setPendingDonations(activeDonations);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "completedOrders"), orderBy("completedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = snapshot.docs.filter((doc) => {
        const completedAt = doc.data().completedAt?.toDate();
        return completedAt && completedAt >= today;
      }).length;

      setCompletedToday(todayCount);
    });

    return () => unsubscribe();
  }, []);

  // Listen to all completed orders
  useEffect(() => {
    const q = query(collection(db, "completedOrders"), orderBy("completedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate(),
      }));

      setAllCompletedOrders(allOrders);

      // Filter for pending donations
      const donations = allOrders.filter(
        (order) => order.donation > 0 && !order.donationVerified
      );
      setPendingDonations(donations);
    });

    return () => unsubscribe();
  }, []);

  // Listen to verified donations total
  useEffect(() => {
    const q = query(collection(db, "verifiedDonations"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const total = snapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      setTotalDonations(total);
    });

    return () => unsubscribe();
  }, []);

  const addToOrder = (drink) => {
    setOrders([...orders, drink]);
  };

  const removeFromOrder = (index) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const selectDrink = (drink) => {
    setCurrentDrink(drink);
  };

  const submitOrder = async (userInfo, donation) => {
    try {
      const newOrder = {
        items: [...orders],
        userInfo,
        donation,
        time: "Just now",
        timestamp: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      clearOrders();
      return { id: docRef.id, ...newOrder };
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  };

  const markOrderAsReady = async (orderId) => {
    try {
      const orderToComplete = submittedOrders.find((order) => order.id === orderId);

      if (orderToComplete) {
        // Move order to completedOrders collection
        await addDoc(collection(db, "completedOrders"), {
          ...orderToComplete,
          completedAt: serverTimestamp(),
          donationVerified: false, // Mark as not yet verified
        });

        // Show notification that order is ready
        showOrderReadyNotification(orderToComplete);
      }

      // Remove from active orders
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.error("Error marking order as ready:", error);
      throw error;
    }
  };

  const verifyDonation = async (orderId, amount, customerName) => {
    try {
      // Mark the order's donation as verified first
      const orderRef = doc(db, "completedOrders", orderId);
      await updateDoc(orderRef, {
        donationVerified: true,
      });

      // Add to verified donations collection
      await addDoc(collection(db, "verifiedDonations"), {
        orderId,
        amount,
        customerName,
        verifiedAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error("Error verifying donation:", error);
      throw error;
    }
  };

  const clearCompletedToday = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(collection(db, "completedOrders"), orderBy("completedAt", "desc"));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs
        .filter((docSnapshot) => {
          const completedAt = docSnapshot.data().completedAt?.toDate();
          return completedAt && completedAt >= today;
        })
        .map((docToDelete) => deleteDoc(doc(db, "completedOrders", docToDelete.id)));

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error clearing completed today:", error);
      throw error;
    }
  };

  const clearTotalDonations = async () => {
    try {
      const q = query(collection(db, "verifiedDonations"));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((docToDelete) =>
        deleteDoc(doc(db, "verifiedDonations", docToDelete.id))
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error clearing total donations:", error);
      throw error;
    }
  };

  const clearAllHistory = async () => {
    try {
      const q = query(collection(db, "completedOrders"));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((docToDelete) =>
        deleteDoc(doc(db, "completedOrders", docToDelete.id))
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error clearing all history:", error);
      throw error;
    }
  };

  const value = {
    orders,
    currentDrink,
    submittedOrders,
    completedToday,
    pendingDonations,
    totalDonations,
    allCompletedOrders,
    addToOrder,
    removeFromOrder,
    clearOrders,
    selectDrink,
    submitOrder,
    markOrderAsReady,
    verifyDonation,
    clearCompletedToday,
    clearTotalDonations,
    clearAllHistory,
    orderCount: orders.length,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
