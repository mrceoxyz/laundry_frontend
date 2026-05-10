'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '2348025589982'; // international format
const MESSAGE = encodeURIComponent(
  'Hello EliteLaundry, I would like to make an enquiry.'
);

export function WhatsAppButton() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
        target="_blank"
      >
        <div className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:bg-green-600">
          <MessageCircle className="h-5 w-5" />
          <span className="hidden md:block text-sm font-medium">
            Chat on WhatsApp
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
