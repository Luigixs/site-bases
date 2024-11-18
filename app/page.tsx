'use client'

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, ChevronLeft, ChevronRight, X, ChevronRightIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Product {
  id: number
  name: string
  image: string
  price: string
  originalPrice?: string
  reviews?: number
}

interface CartItem extends Product {
  quantity: number
}

interface Department {
  name: string
  subcategories?: string[]
}

export default function Component() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showDepartments, setShowDepartments] = useState(false)
  const departmentsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      let newScrollPosition: number

      if (direction === 'left') {
        newScrollPosition = carouselRef.current.scrollLeft - scrollAmount
        if (newScrollPosition < 0) {
          newScrollPosition = 0
        }
      } else {
        newScrollPosition = carouselRef.current.scrollLeft + scrollAmount
        if (newScrollPosition > maxScroll) {
          newScrollPosition = maxScroll
        }
      }

      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollLeft
        const slideWidth = carouselRef.current.offsetWidth
        const totalWidth = carouselRef.current.scrollWidth
        const newSlide = Math.round(scrollPosition / slideWidth)
        setCurrentSlide(newSlide % bestSellers.length)
      }
    }

    carouselRef.current?.addEventListener('scroll', handleScroll)
    return () => carouselRef.current?.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setShowConfirmation(true)
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const cartTotal = cart.reduce((total, item) => total + parseFloat(item.price.replace('.', '').replace(',', '.')) * item.quantity, 0)

  const handleDepartmentsHover = () => {
    if (departmentsTimeoutRef.current) {
      clearTimeout(departmentsTimeoutRef.current)
    }
    departmentsTimeoutRef.current = setTimeout(() => {
      setShowDepartments(true)
    }, 2000)
  }

  const handleDepartmentsLeave = () => {
    if (departmentsTimeoutRef.current) {
      clearTimeout(departmentsTimeoutRef.current)
    }
    setShowDepartments(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg" alt="KaBuM!" width={120} height={40} className="h-10 w-auto" />
          </Link>

          <div className="hidden flex-1 items-center space-x-2 md:flex max-w-xl mx-8">
            <div className="relative flex-1">
              <Input
                placeholder="Aperte o K e busque aqui"
                className="pl-4 pr-10"
              />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-2 py-1">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Category Menu */}
        <nav className="bg-[#F15A24] text-white relative">
          <div className="container">
            <ul className="flex items-center space-x-6 overflow-x-auto py-3 text-sm">
              <li className="relative">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-white hover:bg-white/20"
                  onMouseEnter={handleDepartmentsHover}
                  onMouseLeave={handleDepartmentsLeave}
                >
                  DEPARTAMENTOS <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
                {showDepartments && (
                  <div 
                    className="absolute left-0 top-full z-50 w-72 bg-white shadow-lg rounded-md border border-gray-200"
                    onMouseEnter={() => setShowDepartments(true)}
                    onMouseLeave={handleDepartmentsLeave}
                  >
                    <ul className="py-1">
                      {departments.map((dept, index) => (
                        <li key={index}>
                          <Link 
                            href="#" 
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {dept.name}
                            {dept.subcategories && (
                              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
              <li><Link href="#" className="hover:underline">CUPONS</Link></li>
              <li><Link href="#" className="hover:underline">MONTE SEU PC</Link></li>
              <li><Link href="#" className="hover:underline">OFERTAS DO DIA</Link></li>
              <li><Link href="#" className="hover:underline">KBUM GAMING</Link></li>
              <li><Link href="#" className="hover:underline">FRETE GRÁTIS</Link></li>
              <li><Link href="#" className="hover:underline">HARDWARE</Link></li>
              <li><Link href="#" className="hover:underline">COMPUTADORES</Link></li>
              <li><Link href="#" className="hover:underline">ESQUENTA BLACK</Link></li>
              <li><Link href="#" className="hover:underline">BLACK FRIDAY</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {isCartOpen ? (
          <CartPage 
            cart={cart} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity} 
            cartTotal={cartTotal} 
            setIsCartOpen={setIsCartOpen} 
          />
        ) : (
          <>
            {/* Hero Banner */}
            <section className="relative bg-black">
              <div className="container relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <div className="relative">
                  <Image
                    src="/placeholder.svg"
                    alt="Esquenta Black"
                    width={1200}
                    height={400}
                    className="w-full"
                  />
                  <div className="absolute bottom-8 left-8 space-y-4">
                    <Badge className="bg-black/80 text-white px-4 py-2">
                      🔥 ESQUENTA BLACK
                    </Badge>
                    <h1 className="text-4xl font-bold text-white">
                      Renove seu<br />
                      Espaço Gamer
                    </h1>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-[#FFB800]">
                        ATÉ 30% OFF
                      </div>
                      <Button className="bg-[#F15A24] text-white hover:bg-[#F15A24]/90">
                        APROVEITE AQUI
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </section>

            {/* Promotional Banners */}
            <section className="py-8 bg-[#F15A24]">
              <div className="container grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Image
                    src="/placeholder.svg"
                    alt="Gameplay de qualidade garantida"
                    width={600}
                    height={200}
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-2xl font-bold">Gameplay de qualidade garantida</h2>
                    <p>até 12X sem juros no cartão</p>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg"
                    alt="Ofertas pra você jogar no conforto"
                    width={600}
                    height={200}
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="text-2xl font-bold">Ofertas pra você jogar no conforto</h2>
                    <p>até 12X sem juros no cartão</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Destaques Ninja */}
            <section className="py-8">
              <div className="container">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="text-[#F15A24] mr-2">★</span> DESTAQUES NINJA
                  </h2>
                  <Link href="#" className="text-[#F15A24] hover:underline">
                    VER TODOS <ChevronRight className="inline-block h-4 w-4" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                    <Button variant="outline" className="whitespace-nowrap">TODOS</Button>
                    <Button variant="outline" className="whitespace-nowrap">AR E VENTILAÇÃO</Button>
                    <Button variant="outline" className="whitespace-nowrap">ÁUDIO</Button>
                    <Button variant="outline" className="whitespace-nowrap">CÂMERAS E DRONES</Button>
                    <Button variant="outline" className="whitespace-nowrap">CELULAR & SMARTPHONE</Button>
                    <Button variant="outline" className="whitespace-nowrap">COMPUTADORES</Button>
                    <Button variant="outline" className="whitespace-nowrap">CONECTIVIDADE</Button>
                    <Button variant="outline" className="whitespace-nowrap">ELETROPORTÁTEIS</Button>
                    <Button variant="outline" className="whitespace-nowrap">ESPAÇO GAMER</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
                  {highlightProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                      <div className="relative mb-4 aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <div className="flex mb-2">
                        {"★".repeat(5)}
                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                      <h3 className="text-sm font-medium mb-2 flex-grow">{product.name}</h3>
                      <div className="text-lg font-bold mb-2">R$ {product.price}</div>
                      <div className="text-sm text-gray-500 mb-4">
                        À vista no PIX
                        <br />
                        ou até 12x de R$ {(parseFloat(product.price.replace('.', '').replace(',', '.')) / 12).toFixed(2)}
                      </div>
                      <Button 
                        className="w-full bg-[#F15A24] text-white hover:bg-[#F15A24]/90"
                        onClick={() => addToCart(product)}
                      >
                        COMPRAR
                      </Button>
                      <div className="text-xs text-center mt-2 text-[#F15A24]">
                        TERMINA EM: 12D 09:22:07
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Best Sellers Carousel */}
            <section className="py-8 bg-gray-100">
              <div className="container">
                <h2 className="text-2xl font-bold mb-6">Mais Vendidos</h2>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 text-black hover:bg-white"
                    onClick={() => scrollCarousel('left')}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <div 
                    ref={carouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {bestSellers.map((product, index) => (
                      <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 flex-shrink-0 snap-start p-4">
                        <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                          <div className="relative mb-4 aspect-square">
                            <Image
                              src={product.image}
                              alt={product.name}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                          <h3 className="text-sm font-medium mb-2 flex-grow">{product.name}</h3>
                          <div className="text-lg font-bold">R$ {product.price}</div>
                          <Button 
                            className="w-full mt-2 bg-[#F15A24] text-white hover:bg-[#F15A24]/90"
                            onClick={() => addToCart(product)}
                          >
                            COMPRAR
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 text-black hover:bg-white"
                    onClick={() => scrollCarousel('right')}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
                <div className="flex justify-center mt-4">
                  {bestSellers.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Products Grid */}
            <section className="py-8">
              <div className="container">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">ESQUENTA BLACK</h2>
                  <div className="text-sm">
                    TERMINA EM: <span className="font-bold">12D 21:20:16</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {products.map((product, index) => (
                    <div key={index} className="group relative rounded-lg border bg-card p-4 transition-shadow hover:shadow-lg">
                      <Badge className="absolute left-2 top-2 bg-black text-white">
                        PREÇO BLACK FRIDAY 2024
                      </Badge>
                      <div className="aspect-square mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex">
                          {"★".repeat(4)}{"☆".repeat(1)}
                          <span className="ml-1 text-sm text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {product.originalPrice}
                          </div>
                          <div className="text-xl font-bold">
                            R$ {product.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            à vista por PIX
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-[#F15A24] text-white hover:bg-[#F15A24]/90 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => addToCart(product)}
                        >
                          COMPRAR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* New Section */}
            <section className="py-8 bg-gray-100">
              <div className="container">
                <h2 className="text-2xl font-bold mb-6">Novidades</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newProducts.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4">
                      <div className="relative aspect-square mb-4">
                        <Image
                          src={product.image}
                          alt={product.name}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                      <div className="text-xl font-bold mb-2">R$ {product.price}</div>
                      <Button 
                        className="w-full bg-[#F15A24] text-white hover:bg-[#F15A24]/90"
                        onClick={() => addToCart(product)}
                      >
                        COMPRAR
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Produto adicionado ao carrinho</DialogTitle>
              <DialogDescription>
                O que você gostaria de fazer agora?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Continuar comprando
              </Button>
              <Button onClick={() => {
                setShowConfirmation(false)
                setIsCartOpen(true)
              }}>
                Ir para o carrinho
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

function CartPage({ cart, removeFromCart, updateQuantity, cartTotal, setIsCartOpen }: { 
  cart: CartItem[], 
  removeFromCart: (id: number) => void,
  updateQuantity: (id: number, quantity: number) => void,
  cartTotal: number,
  setIsCartOpen: (isOpen: boolean) => void
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Carrinho</h1>
      {cart.length === 0 ? (
        <div>
          <Alert variant="destructive">
            <AlertTitle>Seu carrinho está vazio</AlertTitle>
            <AlertDescription>
              Adicione produtos ao seu carrinho para continuar suas compras.
            </AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => setIsCartOpen(false)}>
            Voltar para início
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b">
                <div className="flex items-center space-x-4">
                  <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Vendido e entregue por: KaBuM!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {item.price}</p>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-bold mb-4">Resumo</h2>
              <div className="flex justify-between mb-2">
                <span>Valor dos Produtos:</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Frete:</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total à prazo:</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                (em até 6x de R$ {(cartTotal / 6).toFixed(2)} sem juros)
              </div>
              <div className="bg-green-100 p-2 rounded mb-4">
                <p className="text-green-800 font-medium">Valor à vista no PIX: R$ {cartTotal.toFixed(2)}</p>
                <p className="text-sm text-green-600">(Economize: R$ {(cartTotal * 0.05).toFixed(2)})</p>
              </div>
              <Input placeholder="Cupom de desconto" className="mb-4" />
              <Button className="w-full bg-[#F15A24] text-white hover:bg-[#F15A24]/90">
                IR PARA O PAGAMENTO
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const departments: Department[] = [
  { name: 'Hardware', subcategories: ['Processadores', 'Placas de Vídeo', 'Memória RAM'] },
  { name: 'Periféricos', subcategories: ['Mouses', 'Teclados', 'Headsets'] },
  { name: 'Computadores', subcategories: ['Notebooks', 'Desktops', 'All in One'] },
  { name: 'Games', subcategories: ['Consoles', 'Jogos', 'Acessórios'] },
  { name: 'Celular & Smartphone', subcategories: ['Smartphones', 'Capas', 'Carregadores'] },
  { name: 'TV', subcategories: ['Smart TVs', 'LED', 'OLED'] },
  { name: 'Áudio', subcategories: ['Caixas de Som', 'Fones de Ouvido', 'Microfones'] },
  { name: 'Escritório', subcategories: ['Cadeiras de Escritório', 'Mesas', 'Organizadores'] },
]

const bestSellers = [
  { id: 1, name: "Product 1", image: "/placeholder.svg", price: "159,99" },
  { id: 2, name: "Product 2", image: "/placeholder.svg", price: "179,99" },
  { id: 3, name: "Product 3", image: "/placeholder.svg", price: "999,99" },
  { id: 4, name: "Product 4", image: "/placeholder.svg", price: "799,99" },
  { id: 5, name: "Product 5", image: "/placeholder.svg", price: "899,99" },
  { id: 6, name: "Product 6", image: "/placeholder.svg", price: "249,99" },
]

const products = [
  { id: 1, name: "Product 1", image: "/placeholder.svg", price: "1.509,99", originalPrice: "1.899,99", reviews: 67 },
  { id: 2, name: "Product 2",image: "/placeholder.svg", price: "597,99", originalPrice: "799,99", reviews: 122 },
  { id: 3, name: "Product 3", image: "/placeholder.svg", price: "199,99", originalPrice: "299,99", reviews: 143 },
  { id: 4, name: "Product 4", image: "/placeholder.svg", price: "1.359,99", originalPrice: "1.599,99", reviews: 89 },
  { id: 5, name: "Product 5", image: "/placeholder.svg", price: "4.399,99", originalPrice: "4.999,99", reviews: 67 },
]

const highlightProducts = [
  { id: 1, name: "Placa de Vídeo RTX 3080", image: "/placeholder.svg", price: "4.999,99", reviews: 213 },
  { id: 2, name: "SSD 1TB NVMe", image: "/placeholder.svg", price: "799,99", reviews: 114 },
  { id: 3, name: "Monitor Gaming 144Hz", image: "/placeholder.svg", price: "1.299,99", reviews: 89 },
  { id: 4, name: "Teclado Mecânico RGB", image: "/placeholder.svg", price: "399,99", reviews: 148 },
  { id: 5, name: "Mouse Gamer 16000 DPI", image: "/placeholder.svg", price: "249,99", reviews: 76 },
]

const newProducts = [
  { id: 1, name: "Smartphone 5G", image: "/placeholder.svg", price: "2.999,99" },
  { id: 2, name: "Notebook Ultrafino", image: "/placeholder.svg", price: "4.599,99" },
  { id: 3, name: "Smart TV 4K 55\"", image: "/placeholder.svg", price: "3.299,99" },
]