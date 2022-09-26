import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactCardFlip from 'react-card-flip'
import { Row, Col, Card } from 'react-bootstrap'
import styles from '../../styles/components/TarotLotteryDesktop.module.scss'
import TarrotLotteryPayment from './TarrotLotteryPayment'
import { useDeviceStore } from "../../stores/deviceStore"

function TarotLotteryDesktop(props) {
  const isMobile = useDeviceStore((state) => state.isMobile)
  const [flipCards, setFlipCards] = useState([])
  const [userCards, setUserCards] = useState([])
  const [cardsSet, setcardsSet] = useState([])

  const cardBackUrl = '/img/cards/back.png'
  const cardsUrl = '/img/cards/'
  const cardNames = [
    'fool', 'magician', 'high-priestess', 'empress', 'empreror', 'hierophant', 'lovers',
    'chariot', 'strength', 'hermit', 'wheel-of-fortune', 'justice', 'hanged-man', 'death',
    'temperance', 'devil', 'tower', 'star', 'moon', 'sun', 'judgement', 'world',
    'ace-of-wands', 'two-of-wands', 'three-of-wands', 'four-of-wands', 'five-of-wands',
    'six-of-wands', 'seven-of-wands', 'eight-of-wands', 'nine-of-wands', 'ten-of-wands',
    'princess-of-wands', 'knight-of-wands', 'queen-of-wands', 'king-of-wands',
    'ace-of-cups', 'two-of-cups', 'three-of-cups', 'four-of-cups', 'five-of-cups',
    'six-of-cups', 'seven-of-cups', 'eight-of-cups', 'nine-of-cups', 'ten-of-cups',
    'princess-of-cups', 'knight-of-cups', 'queen-of-cups', 'king-of-cups',
    'ace-of-swords', 'two-of-swords', 'three-of-swords', 'four-of-swords', 'five-of-swords',
    'six-of-swords', 'seven-of-swords', 'eight-of-swords', 'nine-of-swords', 'ten-of-swords',
    'princess-of-swords', 'knight-of-swords', 'queen-of-swords', 'king-of-swords',
    'ace-of-pentacles', 'two-of-pentacles', 'three-of-pentacles', 'four-of-pentacles', 'five-of-pentacles',
    'six-of-pentacles', 'seven-of-pentacles', 'eight-of-pentacles', 'nine-of-pentacles', 'ten-of-pentacles',
    'princess-of-pentacles', 'knight-of-pentacles', 'queen-of-pentacles', 'king-of-pentacles',
  ]
  //card lottery on Desktops
  useEffect(() => {
    if (flipCards.length > 0) {
      const img = document.getElementById(`tarot-card-${flipCards.length - 1}`)
      const cardNo = flipCards[flipCards.length - 1]
      const cardName = cardNames[cardNo]
      img.setAttribute('src', `${cardsUrl}/${cardName}.png`)
      setUserCards(prev => [...prev, cardName])

      if (!isMobile) {
        document.getElementById(cardNo).style.display = 'none'
      }
    }
    if (flipCards.length === props.cardSet && !isMobile) {
      document.getElementById('cardSetContainer').style.display = 'none'
    } else if (flipCards.length === props.cardSet && isMobile) {
      document.getElementById('cardMobile').style.display = 'none'
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipCards])

  useEffect(() => {
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
    const cards = shuffle(cardsArr)
    setcardsSet(cards)

  }, [])



  return (
    <>
      <Row className="d-flex mb-3 text-center">
        <h1 className='color-primary mb-2'> {props.title} </h1>
      </Row>
      <Row className="d-flex mb-4 justify-content-center">
        {Array.from({ length: props.cardSet }).map((_, idx) => (
          <Col key={idx} className={`d-flex mb-2 justify-content-end ${(props.cardSet >= 10) ? 'col-2 col-md-2 col-lg-1' : 'col-4 col-md-2 col-lg-2'}   
          ${(window.innerWidth < 768) ? '' : ((props.cardSet < 10) && (idx > 0 && idx < props.cardSet - 1) && 'pt-3')} 
          `}>
            <ReactCardFlip isFlipped={flipCards.length > idx} flipDirection="horizontal">
              <div style={{ opacity: '0.5' }}>
                <Image src={cardBackUrl} width='120' height='200' alt={`back-of-card-${idx}`} />
              </div>
              <div>
                <Card.Img id={`tarot-card-${idx}`} variant="top" alt={`tarot-card-${idx}`} />
              </div>
            </ReactCardFlip>
          </Col>
        ))}
      </Row>

      <Row className="d-flex ms-5 me-5 justify-content-center ">
        {(flipCards.length === 0) && <p className='color-primary'>Focus deeply on your question and {(window.innerWidth < 768) && 'TAP below to'} <strong>choose {props.cardSet} cards</strong></p>}
        {(flipCards.length > 0 && flipCards.length < props.cardSet - 1) && <p className='color-primary'><strong>Okay, {props.cardSet - flipCards.length} more left..</strong></p>}
        {(flipCards.length == props.cardSet - 1) && <p className='color-primary'><strong>And the last one.</strong></p>}

        {(window.innerWidth < 768) ?
          <div id='cardMobile'>
            <Image src='/img/cardsMobileLottery.gif' alt={`tarot-card`} width='176' height='300'
              onClick={() => {
                const random = Math.floor(Math.random() * cardsSet.length)
                const card = cardsSet[random]
                cardsSet.splice(random, 1) //remove card from array
                setFlipCards(prev => [...prev, card])
              }} />
          </div>
          :
          <div id='cardSetContainer' className={`${styles.cardsContainer}  justify-content-center`}>
            {cardsSet.map((card) => (
              <div key={card} id={card} className={`${styles.smallCard} pointer`} onClick={() => setFlipCards([...flipCards, card])}>
                <Image src='/img/card-back-min.png' width='59' height='100' alt={`back-${card}`} />
              </div>
            ))}
          </div>
        }


        {(flipCards.length == props.cardSet) &&
          <TarrotLotteryPayment />
        }
      </Row>
    </>
  )
}

export default TarotLotteryDesktop