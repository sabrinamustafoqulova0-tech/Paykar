import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import GrassIcon from '@mui/icons-material/Grass'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import EggIcon from '@mui/icons-material/Egg'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CakeIcon from '@mui/icons-material/Cake'
import GrainIcon from '@mui/icons-material/Grain'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import CookieIcon from '@mui/icons-material/Cookie'
import CoffeeIcon from '@mui/icons-material/Coffee'
import KitchenIcon from '@mui/icons-material/Kitchen'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import SpaIcon from '@mui/icons-material/Spa'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import LocalMallIcon from '@mui/icons-material/LocalMall'

// Dynamic icon mapping components to replace emojis completely
export const CategoryIcon: React.FC<{ slug: string; fontSize?: 'inherit' | 'small' | 'medium' | 'large'; style?: React.CSSProperties }> = ({ slug, fontSize = 'medium', style }) => {
  switch (slug) {
    case 'molochnye-produkty':
      return <EggIcon fontSize={fontSize} style={style} />
    case 'myaso-ptitsa':
      return <RestaurantIcon fontSize={fontSize} style={style} />
    case 'hleb-i-vypechka':
      return <CakeIcon fontSize={fontSize} style={style} />
    case 'frukty-i-ovoshchi':
      return <GrassIcon fontSize={fontSize} style={style} />
    case 'bakaleya':
      return <GrainIcon fontSize={fontSize} style={style} />
    case 'voda-i-napitki':
      return <LocalDrinkIcon fontSize={fontSize} style={style} />
    case 'sladosti':
      return <CookieIcon fontSize={fontSize} style={style} />
    case 'chay-kofe-kakao':
      return <CoffeeIcon fontSize={fontSize} style={style} />
    case 'konservirovannye-produkty':
      return <KitchenIcon fontSize={fontSize} style={style} />
    case 'gotovaya-eda':
      return <FastfoodIcon fontSize={fontSize} style={style} />
    case 'krasota-i-gigiena':
      return <SpaIcon fontSize={fontSize} style={style} />
    case 'vse-dlya-detey':
      return <ChildCareIcon fontSize={fontSize} style={style} />
    default:
      return <LocalMallIcon fontSize={fontSize} style={style} />
  }
}

export const PaymentMethodIcon: React.FC<{ id: number; fontSize?: 'inherit' | 'small' | 'medium' | 'large'; style?: React.CSSProperties }> = ({ id, fontSize = 'medium', style }) => {
  switch (id) {
    case 1:
      return <LocalAtmIcon fontSize={fontSize} style={style} />
    case 2:
      return <CreditCardIcon fontSize={fontSize} style={style} />
    case 3:
      return <PhoneAndroidIcon fontSize={fontSize} style={style} />
    case 4:
      return <ThumbUpIcon fontSize={fontSize} style={style} />
    default:
      return <CreditCardIcon fontSize={fontSize} style={style} />
  }
}

export const AboutFeatureIcon: React.FC<{ title: string; fontSize?: 'inherit' | 'small' | 'medium' | 'large'; style?: React.CSSProperties }> = ({ title, fontSize = 'medium', style }) => {
  switch (title) {
    case 'Контроль свежести':
      return <GrassIcon fontSize={fontSize} style={style} />
    case 'Доставка до дверей':
      return <LocalShippingIcon fontSize={fontSize} style={style} />
    case 'Собственное производство':
      return <RestaurantMenuIcon fontSize={fontSize} style={style} />
    case 'Удобная оплата':
      return <CreditCardIcon fontSize={fontSize} style={style} />
    default:
      return <CheckCircleIcon fontSize={fontSize} style={style} />
  }
}

// Измененный компонент логотипа с использованием внешней картинки
export const PaykarLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div 
      className="logo" 
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
      onClick={onClick}
    >
      <img 
        src="https://paykar.shop/upload/CMax/ea9/8dp6ztgdkv20zydmf7jend1jo6a7gyly.png" 
        alt="Пайкар Логотип" 
        style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
      />
    </div>
  )
}