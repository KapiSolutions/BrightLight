import React from 'react'
import { Button} from 'react-bootstrap'

function TarrotLotteryPayment() {
  return (
    <div>
        <h4 className="mt-0 color-primary">Okay!</h4>
        <p className="color-primary">Now, if you are curious about what your cards say, you can buy your own private interpretation!</p>
        <Button className="btn-lg mt-2">Buy now</Button>
        <br />
        <Button  variant="outline-accent3" className="mt-2">Add to cart</Button>
        </div>
  )
}

export default TarrotLotteryPayment