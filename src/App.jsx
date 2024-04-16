/** HOOKS **/
import { useEffect, useState } from "react";

/** COMPONENTS **/
import Guitar from "./components/Guitar";
import Header from "./components/Header";

/** DATA **/
import { db } from './data/db'


function App() {

  // Otra forma de pasarle el valor del localStorage
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [ data, setData ] = useState(db) // Como esto es un archivo local podemos pasarselo
  const [ cart, setCart ] = useState(initialCart) // Estado para el carrito (otra forma)
  // const [ cart, setCart ] = useState(JSON.parse(localStorage.getItem('cart')) ?? []) // Estado para el carrito

  const MAX_ITEMS_CART = 5
  const MIN_ITEMS_CART = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart)) // Esto nos permite agregar localStorage instanteneo sin nada mas que ya que usamos el useffect y que se dispare con cada cambio en cart
  }, [cart])

  const addToCart = (item) => {
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if(itemExist >= 0){ //Existe en el carrito de compras
      if(cart[itemExist].quantity >= MAX_ITEMS_CART) return
      // Las reglas de React no se depen romper por ende no se debe mutar
      const updatedCart = [...cart]
      updatedCart[itemExist].quantity++ //Accedemos a la propiedad del elemento que ya existe y le aumentamos la cantidad
      setCart(updatedCart) // Le pasamos la copia de cart que usamos para modificar
    }else{
      item.quantity = 1
      setCart([...cart, item])
      // setCart(prevCart => [...prevCart, item]) // Esta sintaxis se usa cuando pasamos esta prop a otro componente
    }
  }

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(cart => cart.id !== id))
  }

  const increaseQuantity = (id) => {
    const updatedCart = cart.map(item => { // Generamos una nueva variable para no mutar el cart
      if(item.id === id && item.quantity < MAX_ITEMS_CART){
        return { // La copia de lo que ya existe de ese elemento junto con la cantidad mas uno
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item // Igual retornamos los otros elementos que existan en el carrito en ese momento
    })
    setCart(updatedCart)
  }

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity > MIN_ITEMS_CART){
        return{
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <>
    <Header
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      clearCart={clearCart}
    />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map( guitar => (
            <Guitar 
              key={guitar.id}
              guitar={guitar}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
