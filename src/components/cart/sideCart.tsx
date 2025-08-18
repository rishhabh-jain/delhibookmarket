// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   X,
//   Minus,
//   Plus,
//   ShoppingCart,
//   ShoppingBag,
//   Sparkles,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useCart } from "@/context/CartContext";
// import { CartItemUnion } from "@/app/types";



// export function SideCart() {
//   const {
//     items,
//     total,
//     itemCount,
//     updateQuantity,
//     removeItem,
//     isSidecartOpen,
//     closeSidecart,
//     openSidecart,
//   } = useCart();

//   const handleQuantityChange = (item: CartItem, newQuantity: number) => {
//     if (newQuantity > item.stock_quantity && item.stock_status === "instock") {
//       alert(`Only ${item.stock_quantity} copies available`);
//       return;
//     }
//     updateQuantity(item.id, newQuantity);
//   };

//   const handleRemoveItem = (item: CartItemUnion) => {
//     removeItem(item.id);
//   };

//   const getStockBadge = (item: CartItemUnion) => {
//     switch (item.stock_status) {
//       case "outofstock":
//         return (
//           <Badge variant="destructive" className="text-xs font-medium">
//             Out of Stock
//           </Badge>
//         );
//       case "onbackorder":
//         return (
//           <Badge variant="secondary" className="text-xs font-medium">
//             On Backorder
//           </Badge>
//         );
//       default:
//         return item.stock_quantity <= 3 ? "" : null;
//     }
//   };

//   const savings = items.reduce((acc, item) => {
//     if (item.regular_price > item.sale_price) {
//       return acc + (item.regular_price - item.sale_price) * item.quantity;
//     }
//     return acc;
//   }, 0);

//   useEffect(() => {
//     console.log("IS_SIDE_CART", isSidecartOpen);
//     console.log("closesidecart", isSidecartOpen);
//   }, [isSidecartOpen, closeSidecart, openSidecart]);

//   return (
//     <>
//       {/* Cart Trigger Button */}
//       <Button
//         variant="outline"
//         size="sm"
//         className="relative bg-background hover:bg-muted/50 transition-all duration-200"
//         onClick={openSidecart}
//       >
//         <ShoppingCart className="h-4 w-4" />
//         {itemCount > 0 && (
//           <Badge
//             variant="destructive"
//             className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
//           >
//             {itemCount}
//           </Badge>
//         )}
//         <span className="sr-only">Open cart</span>
//       </Button>

//       {/* Side Cart Sheet */}
//       <Sheet
//         open={isSidecartOpen}
//         onOpenChange={(open) => {
//           if (!open) {
//             closeSidecart();
//           }
//         }}
//       >
//         <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
//           <SheetHeader className="px-6 py-4 border-b bg-muted/30">
//             <div className="flex items-center justify-between">
//               <SheetTitle className="flex items-center gap-3 text-lg">
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   <ShoppingCart className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">Shopping Cart</div>
//                   <div className="text-sm text-muted-foreground font-normal">
//                     {itemCount} {itemCount === 1 ? "item" : "items"}
//                   </div>
//                 </div>
//               </SheetTitle>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={closeSidecart}
//                 className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </SheetHeader>

//           {items.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
//               <div className="p-4 bg-muted/30 rounded-full mb-6">
//                 <ShoppingBag className="h-12 w-12 text-muted-foreground" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
//               <p className="text-muted-foreground mb-8 max-w-sm">
//                 Discover amazing books and add them to your cart to get started!
//               </p>
//               <Button asChild onClick={() => closeSidecart()} className="px-8">
//                 <Link href="/books">
//                   <Sparkles className="h-4 w-4 mr-2" />
//                   Browse Books
//                 </Link>
//               </Button>
//             </div>
//           ) : (
//             <div className="flex flex-col h-full">
//               {/* Cart Items */}
//               <ScrollArea className="flex-1 px-6">
//                 <div className="space-y-4 py-6">
//                   {items.map((item, index) => (
//                     <div
//                       key={item.id}
//                       className="group relative bg-card border rounded-xl p-4 hover:shadow-md transition-all duration-200"
//                     >
//                       <div className="flex gap-4">
//                         {/* Book Cover */}
//                         <div className="flex-shrink-0">
//                           <Link
//                             href={item.permalink}
//                             onClick={() => closeSidecart()}
//                             className="block relative overflow-hidden rounded-lg"
//                           >
//                             <Image
//                               src={
//                                 item.image ||
//                                 "/placeholder.svg?height=120&width=80&query=book cover" ||
//                                 "/placeholder.svg"
//                               }
//                               alt={item.name}
//                               width={64}
//                               height={88}
//                               className="object-cover hover:scale-105 transition-transform duration-200"
//                             />
//                           </Link>
//                         </div>

//                         {/* Book Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <Link
//                               href={item.permalink}
//                               onClick={() => closeSidecart()}
//                               className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 leading-tight pr-2"
//                             >
//                               {item.name}
//                             </Link>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleRemoveItem(item)}
//                               className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>

//                           {/* Stock Status */}
//                           <div className="mb-3">{getStockBadge(item)}</div>

//                           {/* Price */}
//                           <div className="flex items-center gap-2 mb-4">
//                             <span className="font-bold text-lg">
//                               ₹{item.price.toFixed(2)}
//                             </span>
//                             {/* {item.regular_price > item.sale_price && (
//                             <span className="text-sm text-muted-foreground line-through">
//                               ₹{item.regular_price.toFixed(2)}
//                             </span>
//                           )} */}
//                             {/* {item.regular_price > item.sale_price && (
//                             <Badge
//                               variant="secondary"
//                               className="text-xs bg-green-100 text-green-700 border-green-200"
//                             >
//                               Save ₹
//                               {(item.regular_price - item.sale_price).toFixed(
//                                 2
//                               )}
//                             </Badge>
//                           )} */}
//                           </div>

//                           {/* Quantity Controls */}
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity - 1)
//                                 }
//                                 disabled={item.quantity <= 1}
//                                 className="h-8 w-8 p-0 hover:bg-background"
//                               >
//                                 <Minus className="h-3 w-3" />
//                               </Button>
//                               <span className="w-12 text-center text-sm font-semibold bg-background rounded px-2 py-1">
//                                 {item.quantity}
//                               </span>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity + 1)
//                                 }
//                                 disabled={
//                                   item.stock_status === "outofstock" ||
//                                   (item.stock_status === "instock" &&
//                                     item.quantity >= item.stock_quantity)
//                                 }
//                                 className="h-8 w-8 p-0 hover:bg-background"
//                               >
//                                 <Plus className="h-3 w-3" />
//                               </Button>
//                             </div>
//                             <div className="text-right">
//                               <div className="text-sm font-bold">
//                                 ₹{(item.price * item.quantity).toFixed(2)}
//                               </div>
//                               {item.regular_price > item.sale_price && (
//                                 <div className="text-xs text-muted-foreground line-through">
//                                   ₹
//                                   {(item.regular_price * item.quantity).toFixed(
//                                     2
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>

//               {/* Cart Footer */}
//               <div className="border-t bg-muted/20 p-6 space-y-4">
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total</span>
//                   <span>₹{total.toFixed(2)}</span>
//                 </div>

//                 <div className="space-y-3">
//                   <Link href="/checkout">
//                     <Button
//                       size="lg"
//                       className="w-full h-12 text-base font-semibold"
//                       disabled={items.some(
//                         (item) => item.stock_status === "outofstock"
//                       )}
//                       onClick={closeSidecart}
//                     >
//                       Proceed to Checkout
//                     </Button>
//                   </Link>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="w-full bg-background hover:bg-muted/50"
//                     asChild
//                     onClick={() => closeSidecart()}
//                   >
//                     <Link href="/cart">View Full Cart</Link>
//                   </Button>
//                 </div>

//                 {items.some((item) => item.stock_status === "outofstock") && (
//                   <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
//                     <p className="text-sm text-destructive text-center font-medium">
//                       Remove out-of-stock items to checkout
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </SheetContent>
//       </Sheet>
//     </>
//   );
// }

import React from 'react'

export default function sideCart() {
  return (
    <div>
      <p>SideCart</p>
    </div>
  )
}

