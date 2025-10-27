import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['Все', 'Бургеры', 'Картофель', 'Напитки', 'Десерты'];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Чизбургер Делюкс',
      description: 'Сочная говяжья котлета, расплавленный сыр чеддер, свежие овощи',
      price: 399,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/89103f0a-847a-4075-a67d-6ea85f957a4f.jpg',
      category: 'Бургеры'
    },
    {
      id: 2,
      name: 'Картофель Фри',
      description: 'Хрустящий золотистый картофель с морской солью',
      price: 149,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/71354541-72b9-41e7-89d8-f672d20bbe84.jpg',
      category: 'Картофель'
    },
    {
      id: 3,
      name: 'Куриные Наггетсы',
      description: 'Нежное куриное филе в хрустящей панировке, 6 шт',
      price: 199,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/16190617-e5dd-4f80-8c41-39433b4a9ddd.jpg',
      category: 'Бургеры'
    },
    {
      id: 4,
      name: 'Биф Бургер',
      description: 'Двойная котлета из мраморной говядины, бекон, сырный соус',
      price: 499,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/89103f0a-847a-4075-a67d-6ea85f957a4f.jpg',
      category: 'Бургеры'
    },
    {
      id: 5,
      name: 'Картофель по-деревенски',
      description: 'Картофельные дольки с травами и специями',
      price: 169,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/71354541-72b9-41e7-89d8-f672d20bbe84.jpg',
      category: 'Картофель'
    },
    {
      id: 6,
      name: 'Кола 0.5л',
      description: 'Освежающий напиток',
      price: 99,
      image: 'https://cdn.poehali.dev/projects/c82b1aea-769f-4243-900a-adc098ddf067/files/89103f0a-847a-4075-a67d-6ea85f957a4f.jpg',
      category: 'Напитки'
    }
  ];

  const filteredItems = selectedCategory === 'Все' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast({
      title: "Добавлено в корзину",
      description: item.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    toast({
      title: "Заказ оформлен! 🎉",
      description: `Ваш заказ на ${getTotalPrice()}₽ принят. Скоро с вами свяжется менеджер.`,
    });
    
    setCartItems([]);
    setIsCartOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍔</div>
            <div>
              <h1 className="text-2xl font-bold text-primary">FastBite</h1>
              <p className="text-xs text-muted-foreground">Быстро. Вкусно. Сочно.</p>
            </div>
          </div>
          
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-secondary">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
                <span className="ml-2">Корзина</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">Ваш заказ</SheetTitle>
              </SheetHeader>
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <Icon name="ShoppingBag" size={64} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">Корзина пуста</p>
                  <p className="text-sm text-muted-foreground mt-2">Добавьте вкусные блюда из меню</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cartItems.map(item => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.price}₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-xl font-bold mb-6">
                      <span>Итого:</span>
                      <span className="text-primary">{getTotalPrice()}₽</span>
                    </div>
                    
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Ваше имя</Label>
                        <Input id="name" name="name" required placeholder="Иван Иванов" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="+7 (999) 123-45-67" />
                      </div>
                      <div>
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Textarea id="address" name="address" required placeholder="Улица, дом, квартира" />
                      </div>
                      <Button type="submit" size="lg" className="w-full text-lg">
                        Оформить заказ на {getTotalPrice()}₽
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            Голоден? Закажи за минуту! 🔥
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Самые сочные бургеры и хрустящий картофель с доставкой за 30 минут
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={24} />
              <span>Быстрая доставка</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={24} />
              <span>Свежие продукты</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={24} />
              <span>С любовью</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-8">Наше меню</h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedCategory(category)}
              className="hover-scale"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden hover-scale cursor-pointer group">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-secondary text-white text-lg px-3 py-1">
                  {item.price}₽
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <Button 
                  onClick={() => addToCart(item)}
                  size="lg"
                  className="w-full text-lg"
                >
                  <Icon name="Plus" size={20} />
                  <span className="ml-2">В корзину</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-accent py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🚀</div>
              <h3 className="text-2xl font-bold">Быстрая доставка</h3>
              <p className="text-muted-foreground">Привезём горячим за 30 минут или бесплатно</p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl">🎯</div>
              <h3 className="text-2xl font-bold">100% качество</h3>
              <p className="text-muted-foreground">Только свежие продукты и проверенные рецепты</p>
            </div>
            <div className="space-y-4">
              <div className="text-6xl">💰</div>
              <h3 className="text-2xl font-bold">Выгодные цены</h3>
              <p className="text-muted-foreground">Акции и скидки для постоянных клиентов</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🍔</div>
          <h3 className="text-2xl font-bold mb-2">FastBite</h3>
          <p className="mb-4">Быстро. Вкусно. Сочно.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="tel:+79991234567" className="hover:underline flex items-center gap-2">
              <Icon name="Phone" size={16} />
              +7 (999) 123-45-67
            </a>
            <a href="mailto:info@fastbite.ru" className="hover:underline flex items-center gap-2">
              <Icon name="Mail" size={16} />
              info@fastbite.ru
            </a>
          </div>
          <p className="mt-6 text-sm opacity-70">© 2024 FastBite. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
