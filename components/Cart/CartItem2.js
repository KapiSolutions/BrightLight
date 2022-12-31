import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Card, Button, Spinner, FloatingLabel, Form } from "react-bootstrap";
import { TbTrashX, TbArrowBackUp } from "react-icons/tb";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";

function CartItem2(props) {
    const { authUserFirestore, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullDesc, setfullDesc] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const truncLength = 100;
  
    async function deleteItem(item) {
      try {
        setLoading(true);
        let cart = [...authUserFirestore.cart];
        cart.splice(item, 1);
  
        await updateProfile({ cart: cart });
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
    async function handleEdit() {
      try {
        setLoadingEdit(true);
        const question = document.getElementById("questionFieldEdit").value;
        let cart = [...authUserFirestore.cart];
        cart[props.idx].question = question;
  
        await updateProfile({ cart: cart });
      } catch (e) {
        console.log(e);
      }
      setEdit(false);
      // setfullDesc(false);
      setLoadingEdit(false);
    }
  return (
    <div>CartItem2</div>
  )
}

export default CartItem2