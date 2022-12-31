import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { IoBagCheckOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import CartItem from "./CartItem";

function Cart(props) {
  const router = useRouter();
  const { authUserFirestore, updateProfile } = useAuth();
  const revTheme = props.theme === "light" ? "dark" : "light";
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let total = 0;
    authUserFirestore.cart.forEach((item) => {
      total = total + item.price;
    });
    setTotalPrice(total);
  }, [authUserFirestore.cart]);

  return (
    <>
      {authUserFirestore.cart.length > 0 ? (
        <>
          {Array.from({ length: authUserFirestore.cart.length }).map((_, idx) => (
            <CartItem key={idx} idx={idx} theme={props.theme} update={updateProfile} />
          ))}
          <p className={`text-${props.theme === "light" ? "dark" : "light"} text-end`}>Total Price: {totalPrice},00 PLN</p>
          <hr className={`text-${revTheme}`} />
          <div
            onClick={() => {
              router.push("/cart-summary#main");
              props.setShowCart(undefined);
            }}
            className={`text-${props.theme === "light" ? "dark" : "light"} pointer text-center fs-5`}
          >
            <IoBagCheckOutline
              className="color-primary me-1 mb-1"
              title="Summary"
              style={{ width: "23px", height: "23px" }}
            />
            Summary
          </div>
        </>
      ) : (
        <p className="color-primary">The cart is empty..</p>
      )}
    </>
  );
}

export default Cart;
