import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Header from '~/components/Header';
import Tabs from '~/components/Tabs';
import Menu from '~/components/Menu';


import {  Container, Content, Card, CardHeader, CardContent, CardFooter, Title, Description, Annotation, CardMenu  } from './styles';


export default function Main(){
  let offset = 0;
  const translateY = new Animated.Value(0); //otimizada para atualizar várias vezes ao arrastar, ao invés de um State
  
  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        }
      }
    ],
    { useNativeDriver: true }, //driver nativo de animações do react-native, garantindo perfomance
  )

  function onHandlerStateChanged(event) {
    if(event.nativeEvent.oldState === State.ACTIVE) { //vendo se o estado anterior do evento anterior era ativo, o q quer dizer q a animação acabou
      let opened = false; //informação se o menu está aberto ou fechado
      const { translationY } = event.nativeEvent;

      offset += translationY; // acrescentando o quanto o usuario desceu na vertical com o card

      // translateY.setOffset(offset); //a animação continua de onde o usuario parou
      // translateY.setValue(0); //restarta o valor da variavel para 0
      
      if (translationY >= 100) { //se o usuario arrastar mais de 100 px, o menu está aberto
        opened = true;
      } else { //quando o usuario não passar de 100px, ele continua de onde parou
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0, //se a opened for true, faz a animação, senão, vai pra 0, ponto inicial
        duration:200,
        useNativeDriver: true,
      }).start(()=>{ //função de callback executada ao finalizar a animação
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      });
    }
  }

  return (
    <Container>
      <Header />

    <Content>
      {/* <CardMenu> */}
        <Menu translateY={translateY} />

        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChanged}
        >
          
          <Card style={{
            transform: [{
              translateY: translateY.interpolate({
                inputRange: [-350, 0, 380], //quando o valor de translateY estiver em 0, o valor passado para a propriedade translateY do transform é 0 e assim por diante
                outputRange: [-50, 0, 380],
                extrapolate: 'clamp',
              }),
            }],
          }}>
            <CardHeader>
              <Icon name="attach-money" size={28} color="#666" />
              <Icon name="visibility-off" size={28} color="#666" />
            </CardHeader>
            <CardContent>
              <Title>Saldo Disponível</Title>
              <Description>R$ 101.230.480,55</Description>
            </CardContent>
            <CardFooter>
              <Annotation>
                Transferência de R$ 20,00 recebida de André Victor Amaral Campelo hoje às 06:02h.
              </Annotation>
            </CardFooter>
          </Card>
        </PanGestureHandler>
      {/* </CardMenu> */}
    </Content>

      <Tabs translateY={translateY}/>
    </Container>
  );
}
