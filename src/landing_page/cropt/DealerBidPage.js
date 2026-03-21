// import React, { useEffect, useState } from "react";

// function DealerBidPage() {
//   const dealerId = localStorage.getItem("userId");
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const storedCart = localStorage.getItem(`dealerCart_${dealerId}`);
//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, [dealerId]);

//   const removeFromCart = (cropId) => {
//     const updatedCart = cart.filter((c) => c._id !== cropId);
//     setCart(updatedCart);
//     localStorage.setItem(
//       `dealerCart_${dealerId}`,
//       JSON.stringify(updatedCart)
//     );
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="container mt-4">
//         <h2>My Bids</h2>
//         <p>No crops added to cart yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <h2>My Bids (Cart)</h2>

//       <div className="row">
//         {cart.map((crop) => (
//           <div key={crop._id} className="col-md-4 mb-3">
//             <div className="card shadow-sm">
//               {crop.imageUrl && (
//                 <img
//                   src={`http://localhost:5000${crop.imageUrl}`}
//                   alt={crop.cropName}
//                   style={{ height: "200px", objectFit: "cover" }}
//                 />
//               )}
//               <div className="card-body">
//                 <h5>{crop.cropName}</h5>
//                 <p>Quantity: {crop.quantity}</p>
//                 <p>Base Price: ₹{crop.price}</p>

//                 <button
//                   className="btn btn-danger w-100"
//                   onClick={() => removeFromCart(crop._id)}
//                 >
//                   ❌ Remove from Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default DealerBidPage;
