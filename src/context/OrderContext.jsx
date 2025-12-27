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
  getDocs,
  where,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";

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
  const [outOfStockDrinks, setOutOfStockDrinks] = useState([]);
  const [outOfStockMilk, setOutOfStockMilk] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      setSubmittedOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "completedOrders"),
      orderBy("completedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = snapshot.docs.filter((doc) => {
        const data = doc.data();
        const completedAt = data.completedAt?.toDate();
        return completedAt && completedAt >= today && !data.archived;
      }).length;

      console.log("Completed today count:", todayCount);
      setCompletedToday(todayCount);
    });

    return () => unsubscribe();
  }, []);

  // Listen to all completed orders
  useEffect(() => {
    const q = query(
      collection(db, "completedOrders"),
      orderBy("completedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate(),
        }))
        .filter((order) => !order.archived); // Filter archived orders in memory

      console.log("All completed orders loaded:", allOrders.length);
      setAllCompletedOrders(allOrders);
    });

    return () => unsubscribe();
  }, []);

  // Calculate pending donations from both active and completed orders
  useEffect(() => {
    // Get donations from active orders (not yet marked ready)
    const activeDonations = submittedOrders.filter(
      (order) => order.donation > 0
    );

    // Get donations from completed orders (marked ready but not verified)
    const completedDonations = allCompletedOrders.filter(
      (order) => order.donation > 0 && !order.donationVerified
    );

    // Combine both lists and remove duplicates by order ID
    const seenIds = new Set();
    const allPendingDonations = [...activeDonations, ...completedDonations].filter(order => {
      if (seenIds.has(order.id)) {
        console.log("Duplicate donation detected and removed:", order.id);
        return false;
      }
      seenIds.add(order.id);
      return true;
    });

    console.log("Pending donations to verify:", allPendingDonations.length);
    console.log("  - From active orders:", activeDonations.length);
    console.log("  - From completed orders:", completedDonations.length);
    setPendingDonations(allPendingDonations);
  }, [submittedOrders, allCompletedOrders]);

  // Listen to verified donations total
  useEffect(() => {
    const q = query(
      collection(db, "verifiedDonations"),
      orderBy("verifiedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const total = snapshot.docs
        .filter((doc) => !doc.data().archived)
        .reduce((sum, doc) => {
          return sum + (doc.data().amount || 0);
        }, 0);

      console.log("Total verified donations:", total);
      setTotalDonations(total);
    });

    return () => unsubscribe();
  }, []);

  // Listen to inventory status
  useEffect(() => {
    const q = query(collection(db, "inventory"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const outOfStock = snapshot.docs
        .filter((doc) => doc.data().inStock === false && doc.data().itemType === "drink")
        .map((doc) => doc.data().drinkName);

      const outOfStockMilkTypes = snapshot.docs
        .filter((doc) => doc.data().inStock === false && doc.data().itemType === "milk")
        .map((doc) => doc.data().milkType);

      console.log("Out of stock drinks:", outOfStock);
      console.log("Out of stock milk types:", outOfStockMilkTypes);
      setOutOfStockDrinks(outOfStock);
      setOutOfStockMilk(outOfStockMilkTypes);
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
      const submittedAt = new Date(); // Store client-side timestamp for immediate access
      const newOrder = {
        items: [...orders],
        userInfo,
        donation,
        time: "Just now",
        timestamp: serverTimestamp(), // Server timestamp for ordering
        submittedAt: submittedAt, // Client timestamp for calculation
      };
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      clearOrders();
      return { id: docRef.id, ...newOrder, submittedAt };
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  };

  const markOrderAsReady = async (orderId) => {
    try {
      const orderToComplete = submittedOrders.find((order) => order.id === orderId);

      if (!orderToComplete) {
        console.error("Order not found in submittedOrders:", orderId);
        throw new Error(`Order ${orderId} not found in active orders`);
      }

      console.log("Marking order as ready:", orderId, "User info:", orderToComplete.userInfo);
      console.log("Order has donation:", orderToComplete.donation);

      // Move order to completedOrders collection
      // Remove the old 'id' field before spreading to avoid confusion
      const { id: oldId, timestamp, ...orderData } = orderToComplete;

      const dataToSave = {
        ...orderData,
        completedAt: serverTimestamp(),
        donationVerified: false, // Mark as not yet verified
        archived: false, // Explicitly set archived status
      };

      console.log("Saving to completedOrders:", dataToSave);

      const docRef = await addDoc(collection(db, "completedOrders"), dataToSave);

      console.log("✅ SUCCESS! Order moved to completedOrders with NEW ID:", docRef.id);
      console.log("Old order ID was:", oldId);
      console.log("Document path:", `completedOrders/${docRef.id}`);

      // Send SMS notification if phone number is provided
      if (orderToComplete.userInfo?.phone) {
        try {
          const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: orderToComplete.userInfo.phone,
              customerName: orderToComplete.userInfo.name,
              orderItems: orderToComplete.items
            })
          });

          if (!response.ok) {
            console.error('Failed to send SMS notification');
          } else {
            console.log('SMS notification sent successfully');
          }
        } catch (smsError) {
          // Don't fail the order completion if SMS fails
          console.error('Error sending SMS:', smsError);
        }
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
      console.log("Verifying donation:", { orderId, amount, customerName });

      // Check if the document exists first
      const orderRef = doc(db, "completedOrders", orderId);
      const orderDoc = await getDocs(query(collection(db, "completedOrders")));

      console.log("All completed order IDs:", orderDoc.docs.map(d => d.id));
      console.log("Looking for order ID:", orderId);

      const exists = orderDoc.docs.some(d => d.id === orderId);

      if (!exists) {
        console.error("Document not found in completedOrders collection!");
        console.error("Order ID:", orderId);
        console.error("Available IDs:", orderDoc.docs.map(d => d.id));
        throw new Error(`Order document ${orderId} not found in completedOrders collection`);
      }

      // Mark the order's donation as verified
      await updateDoc(orderRef, {
        donationVerified: true,
      });

      // Add to verified donations collection
      await addDoc(collection(db, "verifiedDonations"), {
        orderId,
        amount,
        customerName,
        verifiedAt: serverTimestamp(),
        archived: false, // Explicitly set archived status
      });

      console.log("Donation verified successfully");
      return true;
    } catch (error) {
      console.error("Error verifying donation:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw error;
    }
  };

  const clearCompletedToday = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "completedOrders"),
        orderBy("completedAt", "desc")
      );
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);

      snapshot.docs
        .filter((docSnapshot) => {
          const data = docSnapshot.data();
          const completedAt = data.completedAt?.toDate();
          return completedAt && completedAt >= today && !data.archived;
        })
        .forEach((docToArchive) => {
          batch.update(doc(db, "completedOrders", docToArchive.id), {
            archived: true,
            archivedAt: serverTimestamp()
          });
        });

      await batch.commit();
      console.log("Cleared completed orders from today");
      return true;
    } catch (error) {
      console.error("Error archiving completed today:", error);
      throw error;
    }
  };

  const clearTotalDonations = async () => {
    try {
      const q = query(
        collection(db, "verifiedDonations"),
        orderBy("verifiedAt", "desc")
      );
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);

      snapshot.docs
        .filter((docSnapshot) => !docSnapshot.data().archived)
        .forEach((docToArchive) => {
          batch.update(doc(db, "verifiedDonations", docToArchive.id), {
            archived: true,
            archivedAt: serverTimestamp()
          });
        });

      await batch.commit();
      console.log("Cleared all verified donations");
      return true;
    } catch (error) {
      console.error("Error archiving total donations:", error);
      throw error;
    }
  };

  const clearAllHistory = async () => {
    try {
      const q = query(
        collection(db, "completedOrders"),
        orderBy("completedAt", "desc")
      );
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);

      snapshot.docs
        .filter((docSnapshot) => !docSnapshot.data().archived)
        .forEach((docToArchive) => {
          batch.update(doc(db, "completedOrders", docToArchive.id), {
            archived: true,
            archivedAt: serverTimestamp()
          });
        });

      await batch.commit();
      console.log("Cleared all order history");
      return true;
    } catch (error) {
      console.error("Error archiving all history:", error);
      throw error;
    }
  };

  const getOrdersByPhone = async (phoneNumber) => {
    try {
      console.log("Fetching orders for phone:", phoneNumber);

      const q = query(
        collection(db, "completedOrders"),
        orderBy("completedAt", "desc")
      );
      const snapshot = await getDocs(q);

      console.log("Total completed orders in database:", snapshot.docs.length);

      const userOrders = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate(),
        }))
        .filter((order) => {
          const matches = order.userInfo?.phone === phoneNumber;
          if (!matches) {
            console.log("Order phone mismatch:", order.userInfo?.phone, "vs", phoneNumber);
          }
          return matches;
        });

      console.log("Filtered orders for user:", userOrders.length);
      return userOrders;
    } catch (error) {
      console.error("Error fetching orders by phone:", error);
      throw error;
    }
  };

  const getActiveOrdersByPhone = (phoneNumber) => {
    try {
      console.log("Fetching active orders for phone:", phoneNumber);

      // Filter active orders (from submittedOrders state) by phone number
      const userActiveOrders = submittedOrders.filter(
        (order) => order.userInfo?.phone === phoneNumber
      );

      console.log("Active orders for user:", userActiveOrders.length);
      return userActiveOrders;
    } catch (error) {
      console.error("Error fetching active orders by phone:", error);
      throw error;
    }
  };

  const submitReview = async (orderId, rating, comment) => {
    try {
      console.log("Submitting review:", { orderId, rating, comment });
      const orderRef = doc(db, "completedOrders", orderId);

      // Check if document exists first
      const orderSnapshot = await getDocs(query(collection(db, "completedOrders"), where("__name__", "==", orderId)));
      if (orderSnapshot.empty) {
        throw new Error(`Order with ID ${orderId} not found in completedOrders collection`);
      }

      await updateDoc(orderRef, {
        rating,
        reviewComment: comment,
        reviewedAt: serverTimestamp()
      });
      console.log("Review submitted successfully");
      return true;
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw error;
    }
  };

  const getAllReviews = async () => {
    try {
      const q = query(
        collection(db, "completedOrders"),
        orderBy("completedAt", "desc")
      );
      const snapshot = await getDocs(q);

      const reviewedOrders = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          completedAt: doc.data().completedAt?.toDate(),
          reviewedAt: doc.data().reviewedAt?.toDate(),
        }))
        .filter((order) => order.rating !== undefined);

      return reviewedOrders;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  };

  const toggleDrinkStock = async (drinkName, inStock) => {
    try {
      console.log("Toggling stock for:", drinkName, "to:", inStock);

      // Check if inventory document exists for this drink
      const q = query(collection(db, "inventory"), where("drinkName", "==", drinkName), where("itemType", "==", "drink"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create new inventory document
        await addDoc(collection(db, "inventory"), {
          drinkName,
          itemType: "drink",
          inStock,
          updatedAt: serverTimestamp(),
        });
        console.log("Created inventory record for:", drinkName);
      } else {
        // Update existing document
        const docRef = doc(db, "inventory", snapshot.docs[0].id);
        await updateDoc(docRef, {
          inStock,
          updatedAt: serverTimestamp(),
        });
        console.log("Updated inventory record for:", drinkName);
      }

      return true;
    } catch (error) {
      console.error("Error toggling drink stock:", error);
      throw error;
    }
  };

  const toggleMilkStock = async (milkType, inStock) => {
    try {
      console.log("Toggling milk stock for:", milkType, "to:", inStock);

      // Check if inventory document exists for this milk type
      const q = query(collection(db, "inventory"), where("milkType", "==", milkType), where("itemType", "==", "milk"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Create new inventory document
        await addDoc(collection(db, "inventory"), {
          milkType,
          itemType: "milk",
          inStock,
          updatedAt: serverTimestamp(),
        });
        console.log("Created milk inventory record for:", milkType);
      } else {
        // Update existing document
        const docRef = doc(db, "inventory", snapshot.docs[0].id);
        await updateDoc(docRef, {
          inStock,
          updatedAt: serverTimestamp(),
        });
        console.log("Updated milk inventory record for:", milkType);
      }

      return true;
    } catch (error) {
      console.error("Error toggling milk stock:", error);
      throw error;
    }
  };

  const getEstimatedWaitTime = (orderTimestamp = null) => {
    try {
      // Get the 5 most recent completed orders
      const recentCompletedOrders = allCompletedOrders.slice(0, 5);

      let avgPrepTimeMinutes = 5; // Default fallback
      let calculatedFromActualData = false;

      // Check if the most recent order is older than 45 minutes
      const now = new Date();
      const INACTIVITY_THRESHOLD_MS = 45 * 60 * 1000; // 45 minutes in milliseconds

      if (recentCompletedOrders.length > 0) {
        const mostRecentOrder = recentCompletedOrders[0];
        const mostRecentTime = mostRecentOrder.completedAt?.toDate ? mostRecentOrder.completedAt.toDate() : new Date(mostRecentOrder.completedAt);
        const timeSinceLastOrder = now - mostRecentTime;

        if (timeSinceLastOrder > INACTIVITY_THRESHOLD_MS) {
          console.log('📊 Last order was more than 45 minutes ago - using default 5 minute estimate');
          console.log(`   Last order was ${Math.round(timeSinceLastOrder / (1000 * 60))} minutes ago`);
          avgPrepTimeMinutes = 5;
          calculatedFromActualData = false;
        } else {
          // Calculate actual average prep time from recent orders
          const prepTimes = [];

          recentCompletedOrders.forEach(order => {
            // Check if we have both timestamps
            if (order.submittedAt && order.completedAt) {
              // submittedAt might be a Firestore Timestamp or a Date
              const submittedTime = order.submittedAt?.toDate ? order.submittedAt.toDate() : new Date(order.submittedAt);
              const completedTime = order.completedAt?.toDate ? order.completedAt.toDate() : new Date(order.completedAt);

              // Calculate prep time in minutes
              const prepTimeMs = completedTime - submittedTime;
              const prepTimeMinutes = prepTimeMs / (1000 * 60);

              // Only include reasonable times (1-30 minutes) to filter out anomalies
              if (prepTimeMinutes > 0 && prepTimeMinutes <= 30) {
                prepTimes.push(prepTimeMinutes);
              }
            }
          });

          // If we have valid prep times, calculate average
          if (prepTimes.length > 0) {
            const totalTime = prepTimes.reduce((sum, time) => sum + time, 0);
            avgPrepTimeMinutes = totalTime / prepTimes.length;
            calculatedFromActualData = true;

            console.log(`📊 Wait time calculated from ${prepTimes.length} recent orders:`, {
              prepTimes: prepTimes.map(t => t.toFixed(1) + 'min'),
              average: avgPrepTimeMinutes.toFixed(1) + 'min'
            });
          }
        }
      }

      // Calculate queue length - only count orders submitted BEFORE this order
      let queueLength;
      if (orderTimestamp) {
        // Count orders that were submitted before this order
        console.log('📊 Calculating queue for order with timestamp:', orderTimestamp);
        console.log('📊 Total submitted orders:', submittedOrders.length);

        queueLength = submittedOrders.filter(order => {
          const orderTime = order.submittedAt?.toDate ? order.submittedAt.toDate() : new Date(order.submittedAt);
          const isBefore = orderTime < orderTimestamp;
          console.log(`   Order ${order.id.slice(-6)} submitted at ${orderTime.toLocaleTimeString()} - Before? ${isBefore}`);
          return isBefore;
        }).length;
        console.log(`📊 Queue length: ${queueLength} orders ahead of this one`);
      } else {
        // If no timestamp provided, use total queue (for general estimates)
        queueLength = submittedOrders.length;
        console.log(`📊 No timestamp provided - using total queue: ${queueLength}`);
      }

      // If no historical data, use intelligent defaults based on queue
      if (!calculatedFromActualData) {
        if (queueLength === 0) {
          avgPrepTimeMinutes = 4;
        } else if (queueLength <= 2) {
          avgPrepTimeMinutes = 5;
        } else if (queueLength <= 5) {
          avgPrepTimeMinutes = 7;
        } else {
          avgPrepTimeMinutes = 9;
        }
        console.log('📊 Wait time using default estimate (no historical data)');
      }

      // Calculate total wait time

      // Base prep time for the new order + time for orders ahead in queue
      // Assume orders ahead will take the same average time
      const totalWaitMinutes = avgPrepTimeMinutes + (queueLength * avgPrepTimeMinutes);

      // Create a conservative range (round to nearest minute)
      // Min: -15% of estimate (but at least 3 min)
      // Max: +20% of estimate
      const minTime = Math.max(3, Math.round(totalWaitMinutes * 0.85));
      const maxTime = Math.ceil(totalWaitMinutes * 1.2);

      // Generate display text
      let displayText;
      if (queueLength === 0) {
        displayText = `${minTime}-${maxTime} minutes`;
      } else {
        displayText = `${minTime}-${maxTime} minutes (${queueLength} ${queueLength === 1 ? 'order' : 'orders'} ahead)`;
      }

      // Log for debugging
      console.log('⏱️ Wait time estimate:', {
        avgPrepTime: avgPrepTimeMinutes.toFixed(1) + 'min',
        queueLength,
        totalEstimate: totalWaitMinutes.toFixed(1) + 'min',
        range: `${minTime}-${maxTime}min`,
        dataSource: calculatedFromActualData ? 'historical' : 'default'
      });

      return {
        min: minTime,
        max: maxTime,
        queueLength: queueLength,
        avgPrepTime: Math.round(avgPrepTimeMinutes),
        displayText: displayText,
        calculatedFromData: calculatedFromActualData
      };
    } catch (error) {
      console.error("Error calculating wait time:", error);
      return {
        min: 5,
        max: 10,
        queueLength: 0,
        avgPrepTime: 5,
        displayText: "5-10 minutes",
        calculatedFromData: false
      };
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
    outOfStockDrinks,
    outOfStockMilk,
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
    getOrdersByPhone,
    getActiveOrdersByPhone,
    submitReview,
    getAllReviews,
    toggleDrinkStock,
    toggleMilkStock,
    getEstimatedWaitTime,
    orderCount: orders.length,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
