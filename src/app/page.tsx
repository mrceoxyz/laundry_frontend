/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image'
import { useTheme } from 'next-themes';
import image1 from '@/src/img/1.jpg'
import image2 from '@/src/img/2.jpg'
import image3 from '@/src/img/3.jpg'
import { ArrowRight, Package, LayoutDashboard, MessageSquare, Truck, ShieldCheck, Sparkles } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';

const slides = [
  {
    title: 'Smart Laundry Operations',
    subtitle: 'Automate orders, payments, and tracking effortlessly.',
    icon: Sparkles
  },
  {
    title: 'Fast Pickup & Delivery',
    subtitle: 'Optimized logistics with real-time updates.',
    icon: Truck
  },
  {
    title: 'Secure & Scalable',
    subtitle: 'Enterprise-grade security and performance.',
    icon: ShieldCheck
  }
];

const heroImages = [image1, image2, image3];


export default function Home() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = slides[index].icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* THEME TOGGLE */}
      {/* <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div> */}

      {/* HERO */}
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* BACKGROUND IMAGE SLIDER */}
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src={img}
                alt={`Hero background ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </motion.div>
          ))}

          {/* OVERLAY FOR READABILITY */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 text-white"
            >
              <span className="bg-linear-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EliteLaundry
              </span>{' '}
              Solutions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-200 mb-10"
            >
              Convenient, Reliable and Timely
            </motion.p>

            {/* SLIDE TEXT (OPTIONAL) */}
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-semibold text-white">
                {slides[index].title}
              </h2>
              <p className="text-gray-300 mt-2">
                {slides[index].subtitle}
              </p>
            </motion.div>

            {!isAuthenticated ? (
              <div className="flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-lg text-gray-200">
                Welcome back, <span className="font-semibold">{user?.first_name}</span>
              </p>
            )}
          </div>
        </div>
      </section>


      {/* PRICING */}
      {/* <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Simple, Transparent Pricing
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard title="Basic" price="₦5,000" features={['Order tracking', 'Standard service']} />
          <PricingCard
            title="Standard"
            price="₦12,000"
            highlight
            features={['Express service', 'Pickup & delivery', 'Priority support']}
          />
          <PricingCard
            title="Business"
            price="₦25,000"
            features={['Multi-branch', 'Staff management', 'Analytics']}
          />
        </div>
      </section> */}

      {/* DASHBOARD SHORTCUTS */}
      {isAuthenticated && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 mt-10 gap-8">
            <ActionCard icon={Package} title="Create Order" href="/order" />
            {isAdmin && <ActionCard icon={LayoutDashboard} title="Admin Dashboard" href="/admin" />}
            <ActionCard icon={MessageSquare} title="Feedback" href="/feedback" />
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function PricingCard({
  title,
  price,
  features,
  highlight
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card
        className={`relative ${
          highlight ? 'border-indigo-500 shadow-lg' : 'border-border'
        }`}
      >
        {highlight && (
          <span className="absolute top-4 right-4 text-xs bg-indigo-500 text-white px-2 py-1 rounded">
            Most Popular
          </span>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-3xl font-bold mt-2">{price}</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {features.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <Button className="w-full mt-6">Choose Plan</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  href
}: {
  icon: any;
  title: string;
  href: string;
}) {
  return (
    <motion.div whileHover={{ y: -6 }}>
      <Link href={href}>
        <Card className="border-0 shadow-md hover:border-indigo-500 hover:shadow-lg">
          <CardHeader className='text-center'>
            <Icon className="h-10 w-10 text-indigo-400 mb-2 text-center ml-55" />
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
              {/* <Button className="w-full">Continue</Button> */}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
