// "use client";
// // @ts-nocheck

// import Image from "next/image";
// import Link from "next/link";
// import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { useCart } from "@/context/CartContext";
// import DeliveryChecker from "@/components/DeliveryChecker";

// // Mock useCart hook - replace with your actual implementation
// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   regular_price: number;
//   sale_price: number;
//   quantity: number;
//   image?: string;
//   stock_quantity: number;
//   stock_status: "instock" | "outofstock" | "onbackorder";
//   permalink: string;
// }

// export default function CartClient() {
//   const { items, total, itemCount, updateQuantity, removeItem } = useCart();

//   const handleQuantityChange = (item: CartItem, newQuantity: number) => {
//     if (newQuantity > item.stock_quantity && item.stock_status === "instock") {
//       return;
//     }
//     updateQuantity(item.id, newQuantity);
//   };

//   const handleRemoveItem = (item: CartItem) => {
//     removeItem(item.id);
//   };

//   const getStockBadge = (item: CartItem) => {
//     switch (item.stock_status) {
//       case "outofstock":
//         return (
//           <Badge variant="destructive" className="text-xs">
//             Out of Stock
//           </Badge>
//         );
//       case "onbackorder":
//         return (
//           <Badge variant="secondary" className="text-xs">
//             On Backorder
//           </Badge>
//         );
//       default:
//         return item.stock_quantity <= 3 ? (
//           <Badge variant="outline" className="text-xs">
//             Only {item.stock_quantity} left
//           </Badge>
//         ) : null;
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-6 min-h-screen">
//         <div className="max-w-md mx-auto text-center pt-16">
//           <ShoppingBag className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mb-4 sm:mb-6" />
//           <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
//             Your cart is empty
//           </h1>
//           <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base px-4">
//             Looks like you have not added any books to your cart yet.
//           </p>
//           <Button asChild size="lg" className="w-full sm:w-auto">
//             <Link href="/">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Continue Shopping
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Header */}
//       <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 sm:hidden">
//         <div className="flex items-center justify-between">
//           <Button variant="ghost" size="sm" asChild>
//             <Link href="/">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Link>
//           </Button>
//           <div className="text-center">
//             <h1 className="font-semibold">Cart</h1>
//             <p className="text-xs text-muted-foreground">
//               {itemCount} {itemCount === 1 ? "item" : "items"}
//             </p>
//           </div>
//           <div className="w-16"></div> {/* Spacer for centering */}
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-4 sm:py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Desktop Header */}
//           <div className="hidden sm:flex items-center gap-4 mb-8">
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Continue Shopping
//               </Link>
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold">Shopping Cart</h1>
//               <p className="text-muted-foreground">
//                 {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
//               </p>
//             </div>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-3 sm:space-y-4">
//               {items.map((item) => {
//                 const slug = item.permalink.split("/").filter(Boolean).pop();
//                 return (
//                   <Card key={item.id} className="overflow-hidden">
//                     <CardContent className="p-3 sm:p-6">
//                       {/* Mobile Layout */}
//                       <div className="sm:hidden">
//                         <div className="flex gap-3 mb-3">
//                           <div className="flex-shrink-0">
//                             <Link href={`/${slug}`}>
//                               <Image
//                                 src={
//                                   item.image ||
//                                   "/placeholder.svg?height=120&width=90&query=book cover" ||
//                                   "/placeholder.svg"
//                                 }
//                                 alt={item.name}
//                                 width={60}
//                                 height={80}
//                                 className="rounded border object-cover"
//                               />
//                             </Link>
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-start mb-2">
//                               <Link
//                                 href={`/${slug}`}
//                                 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2"
//                               >
//                                 {item.name}
//                               </Link>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleRemoveItem(item)}
//                                 className="text-muted-foreground hover:text-destructive p-1 h-8 w-8 ml-2"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                             <div className="mb-2">{getStockBadge(item)}</div>
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <span className="font-bold text-base">
//                                   ₹{item.price.toFixed(2)}
//                                 </span>
//                                 {item.regular_price > item.sale_price && (
//                                   <span className="text-xs text-muted-foreground line-through ml-1">
//                                     ₹{item.regular_price.toFixed(2)}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Mobile Quantity and Total */}
//                         <div className="flex items-center justify-between pt-3 border-t">
//                           <div className="flex items-center gap-3">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 handleQuantityChange(item, item.quantity - 1)
//                               }
//                               disabled={item.quantity <= 1}
//                               className="h-8 w-8 p-0"
//                             >
//                               <Minus className="h-3 w-3" />
//                             </Button>
//                             <span className="font-medium min-w-[2rem] text-center">
//                               {item.quantity}
//                             </span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 handleQuantityChange(item, item.quantity + 1)
//                               }
//                               disabled={
//                                 item.stock_status === "outofstock" ||
//                                 (item.stock_status === "instock" &&
//                                   item.quantity >= item.stock_quantity)
//                               }
//                               className="h-8 w-8 p-0"
//                             >
//                               <Plus className="h-3 w-3" />
//                             </Button>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm font-semibold">
//                               ₹{(item.price * item.quantity).toFixed(2)}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Desktop Layout */}
//                       <div className="hidden sm:flex gap-4">
//                         <div className="flex-shrink-0">
//                           <Link href={`/${slug}`}>
//                             <Image
//                               src={item.image ?? "/placeholder.svg"}
//                               alt={item.name}
//                               width={100}
//                               height={133}
//                               className="rounded-md border object-cover hover:opacity-80 transition-opacity"
//                             />
//                           </Link>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <Link
//                               href={`/${slug}`}
//                               className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
//                             >
//                               {item.name}
//                             </Link>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleRemoveItem(item)}
//                               className="text-muted-foreground hover:text-destructive"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                           <div className="mb-3">{getStockBadge(item)}</div>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <span className="font-bold text-lg">
//                                 ₹{item.price.toFixed(2)}
//                               </span>
//                               {item.regular_price > item.sale_price && (
//                                 <span className="text-sm text-muted-foreground line-through">
//                                   ₹{item.regular_price.toFixed(2)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity - 1)
//                                 }
//                                 disabled={item.quantity <= 1}
//                               >
//                                 <Minus className="h-3 w-3" />
//                               </Button>
//                               <span className="w-12 text-center font-medium">
//                                 {item.quantity}
//                               </span>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity + 1)
//                                 }
//                                 disabled={
//                                   item.stock_status === "outofstock" ||
//                                   (item.stock_status === "instock" &&
//                                     item.quantity >= item.stock_quantity)
//                                 }
//                               >
//                                 <Plus className="h-3 w-3" />
//                               </Button>
//                             </div>
//                           </div>
//                           <div className="mt-3 text-right">
//                             <span className="text-sm text-muted-foreground">
//                               Subtotal:{" "}
//                               <span className="font-semibold text-foreground">
//                                 ₹{(item.price * item.quantity).toFixed(2)}
//                               </span>
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}

//               {/* Delivery Checker - Mobile */}
//               <div className="sm:hidden">
//                 <Card>
//                   <CardContent className="p-4">
//                     <DeliveryChecker />
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             {/* Delivery Checker - Desktop */}
//             <div className="hidden sm:block lg:hidden">
//               <Card>
//                 <CardContent className="p-4">
//                   <DeliveryChecker />
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <Card className="lg:sticky lg:top-4">
//                 <CardContent className="p-4 sm:p-6">
//                   <h2 className="text-lg sm:text-xl font-semibold mb-4">
//                     Order Summary
//                   </h2>
//                   <div className="space-y-3 mb-4">
//                     <div className="flex justify-between text-sm sm:text-base">
//                       <span>Subtotal ({itemCount} items)</span>
//                       <span>₹{total.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
//                       <span>Tax</span>
//                       <span>Calculated at checkout</span>
//                     </div>
//                   </div>
//                   <Separator className="my-4" />
//                   <div className="flex justify-between text-base sm:text-lg font-semibold mb-4 sm:mb-6">
//                     <span>Total</span>
//                     <span>₹{total.toFixed(2)}</span>
//                   </div>

//                   {/* Desktop Delivery Checker */}
//                   <div className="hidden lg:block mb-6">
//                     <DeliveryChecker />
//                   </div>

//                   <Link href="/checkout">
//                     <Button
//                       size="lg"
//                       className="w-full h-12 text-base font-medium"
//                       disabled={items.some(
//                         (item) => item.stock_status === "outofstock"
//                       )}
//                     >
//                       Proceed to Checkout
//                     </Button>
//                   </Link>

//                   {items.some((item) => item.stock_status === "outofstock") && (
//                     <p className="text-xs sm:text-sm text-destructive mt-2 text-center">
//                       Please remove out-of-stock items to continue
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Bottom Bar */}

//       {/* Bottom padding for mobile to account for fixed bottom bar */}
//       <div className="sm:hidden h-24"></div>
//     </div>
//   );
// }
