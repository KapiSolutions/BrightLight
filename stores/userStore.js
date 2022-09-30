import create from "zustand";

export const useUserStore = create((set) => ({
  id: "",
  name: "",
  lastName: "",
  age: "",
  email: "",
  role: "",
  cart: "",
}));

// update states outside of the components
// useUserStore.setState({
//   id: uid,
//   name: docSnap.data().name,
//   lastName: docSnap.data().lastName,
//   age: docSnap.data().age,
//   email: docSnap.data().email,
//   role: docSnap.data().role,
//   cart: docSnap.data().cart,
// });