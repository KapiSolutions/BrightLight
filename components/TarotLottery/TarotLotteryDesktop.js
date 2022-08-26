import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactCardFlip from 'react-card-flip'
import { Row, Col, Card } from 'react-bootstrap'
import styles from '../../styles/components/TarotLotteryDesktop.module.scss'
import TarrotLotteryPayment from './TarrotLotteryPayment'

function TarotLotteryDesktop(props) {
  const [flip1, setFlip1] = useState(false)
  const [flip2, setFlip2] = useState(false)
  const [flip3, setFlip3] = useState(false)

  const cardsArr = []
  for (let i = 0; i < 78; i++) {
    cardsArr[i] = i
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
  const cardsSet = shuffle(cardsArr);

  const flipCard = (id) => {
    if (!flip1 && !flip2 && !flip3) {
      const card1 = 'chariot'
      const img = document.getElementById('tarot-card-1')
      img.setAttribute('src', `/img/cards/${card1}.png`)
      document.getElementById(id).style.display = 'none'
      setFlip1(true)

    } else if (flip1 && !flip2 && !flip3) {
      const card2 = 'tower'
      const img = document.getElementById('tarot-card-2')
      img.setAttribute('src', `/img/cards/${card2}.png`)
      document.getElementById(id).style.display = 'none'
      setFlip2(true)

    } else if (flip1 && flip2 && !flip3) {
      const card3 = 'fool'
      const img = document.getElementById('tarot-card-3')
      img.setAttribute('src', `/img/cards/${card3}.png`)
      document.getElementById(id).style.display = 'none'
      document.getElementById('cardSetContainer').style.display = 'none'
      setFlip3(true)
    }
  }

  return (
    <>
      <Row className="d-flex mb-3 text-center">
        <h1 className='color-primary mb-2'> {props.title} </h1>

      </Row>
      <Row className="d-flex mb-4 justify-content-center">

        <Col className="d-flex col-sm-4 col-md-5 pt-3 justify-content-end">
          <ReactCardFlip isFlipped={!!flip1}
            flipDirection="horizontal">
            <div style={{ opacity: '0.5' }}>
              <Image src='/img/cards/back.png' width='120' height='200' alt="back-of-card" />
            </div>
            <div>
              <Card.Img id='tarot-card-1' variant="top" width='118' height='200' alt='tarot-card-1' />
            </div>
          </ReactCardFlip>
        </Col>

        <Col className="d-flex col-sm-4 col-md-2 justify-content-center">
          <ReactCardFlip isFlipped={!!flip2}
            flipDirection="horizontal">
            <div style={{ opacity: '0.5' }}>
              <Image src='/img/cards/back.png' width='120px' height='200px' alt="back-of-card" />
            </div>
            <div>
              <Card.Img id='tarot-card-2' variant="top" width='118' height='200' alt='tarot-card-2' />
            </div>
          </ReactCardFlip>
        </Col>

        <Col className="d-flex col-sm-4 col-md-5 pt-3 justify-content-start">
          <ReactCardFlip isFlipped={!!flip3}
            flipDirection="horizontal">
            <div style={{ opacity: '0.5' }}>
              <Image src='/img/cards/back.png' width='120' height='200' alt="back-of-card" />
            </div>
            <div>
              <Card.Img id='tarot-card-3' variant="top" width='118' height='200' alt='tarot-card-3' />
            </div>
          </ReactCardFlip>
        </Col>
      </Row>
      <Row className="d-flex ms-5 me-5 justify-content-center ">

        {(!flip1 && !flip2 && !flip3) && <p className='color-primary'>Focus deeply on your question and <strong>choose 3 cards</strong></p>}
        {(flip1 && !flip2 && !flip3) && <p className='color-primary'><strong>Okay, 2 more left..</strong></p>}
        {(flip1 && flip2 && !flip3) && <p className='color-primary'><strong>And the last one.</strong></p>}

        <div id='cardSetContainer' className={`${styles.cardsContainer}  justify-content-center`}>
          {cardsSet.map((card) => (
            <div key={card} id={card} className={`${styles.smallCard} pointer`} onClick={() => flipCard(card)}>
              <Image src='/img/card-back-min.png' width='59' height='100' alt={`back-${card}`} />
            </div>
          ))}
        </div>


        {(flip1 && flip2 && flip3) &&
          <TarrotLotteryPayment />
        }

      </Row>
    </>
  )
}

export default TarotLotteryDesktop