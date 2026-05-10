/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Target, Eye, Mail, Linkedin, Twitter } from 'lucide-react';
import ceoImage from '@/src/img/ceo_md.jpeg'; // replace with actual image
import ctoImage from '@/src/img/passport1.jpg'; // replace with actual image


const leadership = [
  {
    name: 'Usman Usman Mustapha',
    role: 'Chief Executive Officer (CEO)',
    bio: 'Founder and CEO of EliteLaundry Solutions, focused on operational excellence, customer satisfaction, and business growth.',
    image: ceoImage,
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mailto:ceo@elitelaundry.com',
    },
  },
  {
    name: 'Aliyu Ibrahim Umar',
    role: 'Chief Technology Officer (CTO)',
    bio: 'Leads the technology vision, platform scalability, and security of EliteLaundry Solutions.',
    image: ctoImage,
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mailto:cto@elitelaundry.com',
    },
  },
];

// const staffMembers = [
//   {
//     name: 'Amina Yusuf',
//     role: 'Operations Manager',
//     image: '/team/staff1.jpg',
//   },
//   {
//     name: 'Samuel Okoye',
//     role: 'Logistics Supervisor',
//     image: '/team/staff2.jpg',
//   },
//   {
//     name: 'Fatima Bello',
//     role: 'Customer Support',
//     image: '/team/staff3.jpg',
//   },
// ];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* PAGE HEADER */}
      <section className="relative py-24 bg-muted">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            About Us
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Professional laundry services built on quality, hygiene, and reliability
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-6xl mx-auto px-6 space-y-16">
        {/* ABOUT PARAGRAPH */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-lg leading-relaxed"
        >
          <p>
            Our laundry service is established to deliver reliable, high-quality garment care
            solutions that meet the expectations of both individual and corporate clients. Built on
            professionalism, consistency, and operational excellence, the business was founded to
            address the growing need for dependable laundry services that combine efficiency with
            strict hygiene standards.
          </p>

          <p>
            The founder’s philosophy is anchored in the understanding that laundry services play a
            critical role in personal presentation and organizational standards. As such, every
            garment entrusted to us is handled with care, precision, and adherence to established
            processes designed to preserve fabric quality while ensuring optimal cleanliness.
          </p>

          <div>
            <p className="font-semibold mb-3">Our operations are guided by a commitment to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Timely and dependable pickup and delivery</li>
              <li>Proper fabric handling and quality control</li>
              <li>High hygiene and safety standards</li>
              <li>Customer-focused service delivery</li>
            </ul>
          </div>

          <p>
            Today, we serve households, professionals, and organizations seeking a trusted laundry
            partner. Our focus remains on delivering consistent results, operational reliability, and
            measurable service value.
          </p>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                To provide professional, hygienic, and reliable laundry services through efficient
                processes, quality control, and customer-focused solutions that support our clients’
                daily and operational needs.
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-500" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                To become a trusted and recognized laundry service provider known for service
                excellence, operational efficiency, and long-term partnerships with individuals and
                organizations.
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* LEADERSHIP SECTION (OPTIONAL) */}
        {/* <section className="pt-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Leadership</h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Image
              src={ceoImage}
              alt="Founder / CEO"
              className="rounded-2xl object-cover shadow-lg"
            />

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Founder & CEO</h3>
              <p className="text-muted-foreground leading-relaxed">
                The company is led by a founder committed to operational excellence, service quality,
                and long-term customer trust. Leadership focuses on structured processes, continuous
                improvement, and maintaining high professional standards across all operations.
              </p>
            </div>
          </div>
        </section> */}
      </section>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {leadership.map((person) => (
            <motion.div
              key={person.name}
              whileHover={{ y: -6 }}
            >
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="p-0">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={200}
                    height={200}
                    className="object-cover h-150 w-full"
                  />
                </CardHeader>

                <CardContent className="p-6">
                  <CardTitle className="text-xl">{person.name}</CardTitle>
                  <p className="text-sm text-green-500 mb-3">{person.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {person.bio}
                  </p>

                  <div className="flex gap-3">
                    <SocialLink href={person.socials.linkedin} icon={Linkedin} />
                    <SocialLink href={person.socials.twitter} icon={Twitter} />
                    <SocialLink href={person.socials.email} icon={Mail} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STAFF ================= */}
      {/* <section className="bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Staff</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {staffMembers.map((staff) => (
              <motion.div key={staff.name} whileHover={{ scale: 1.03 }}>
                <Card className="text-center shadow-md">
                  <CardHeader className="p-0">
                    <Image
                      src={staff.image}
                      alt={staff.name}
                      width={400}
                      height={300}
                      className="object-cover h-48 w-full"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{staff.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ================= CONTACT US ================= */}
      <ContactSection />
    </div>
  );
}

/* ================= CONTACT SECTION ================= */

function ContactSection() {
  return (
    <>
    
      <section className="bg-muted py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Contact Us
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* CONTACT DETAILS */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-muted-foreground leading-relaxed">
                We are always available to answer inquiries, schedule pickups, and
                provide reliable laundry solutions for individuals and organizations.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-muted-foreground">
                    Plot 12, Example Street, Kano, Nigeria
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">
                    +234 801 234 5678
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">
                    support@elitelaundry.com
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Working Hours</p>
                  <p className="text-muted-foreground">
                    Monday – Saturday: 8:00 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* GOOGLE MAP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-lg border"
            >
              <iframe
                src="https://www.google.com/maps?q=Kano%20Nigeria&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[350px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

    </>
    );
}

function SocialLink({ href, icon: Icon }: any) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-muted hover:bg-green-500 hover:text-white transition"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

// function ContactItem({ icon: Icon, title, text }: any) {
//   return (
//     <div className="flex items-start gap-4">
//       <div className="p-3 bg-green-100 text-green-600 rounded-full">
//         <Icon className="h-5 w-5" />
//       </div>
//       <div>
//         <p className="font-semibold">{title}</p>
//         <p className="text-muted-foreground">{text}</p>
//       </div>
//     </div>
//   );
// }