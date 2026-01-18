import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Send,
  Users
} from "lucide-react";

export default function Contact(){
  const [form, setForm]=useState({
    name:"",
    email:"",
    message:"",
  });

  const handleChange=(e)=>
    setForm({ ...form, [e.target.name]: e.target.value });

  const FORM_ENDPOINT = "https://formspree.io/f/mnjjjwkb";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res=await fetch(FORM_ENDPOINT, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
        },
        body:JSON.stringify(form),
      });

      if(res.ok){
        alert("✅ Message sent successfully! We will contact you soon.");
        setForm({ name: "", email: "", message: "" });
      }
      else{
        alert("❌ Failed to send message. Please try again.");
      }
    }
    catch(err){
      alert("⚠️ Network error. Please check your connection.");
    }
  };


  return(
    <main className="min-h-screen bg-gradient-to-br from-[#071a33] to-[#020b18] text-white overflow-hidden">


      <section className="min-h-[100vh] flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-yellow-400"
        >
          Contact Auctonix
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300 mt-6 max-w-2xl text-lg"
        >
          We’re here to help you build trust, transparency, and success in every auction experience.
        </motion.p>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-16 text-yellow-400 text-xl"
        >
          ↓ Scroll to Explore ↓
        </motion.div>
      </section>


      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
        {[
          { icon: Phone, title: "Phone", value: "+91 9025758149" },
          { icon: Mail, title: "Email", value: "support@auctonix.com" },
          { icon: MapPin, title: "Location", value: "Tiruchengode, Tamil Nadu" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-[#0b2a55] rounded-2xl p-8 shadow-xl border-t-4 border-yellow-400"
          >
            <item.icon size={40} className="text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.value}</p>
          </motion.div>
        ))}
      </section>


      <section className="px-6 pb-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto overflow-hidden rounded-3xl border-4 border-yellow-400 shadow-2xl"
        >
          <iframe
            title="Auctonix Location"
            className="w-full h-[450px]"
            src="https://maps.google.com/maps?q=chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </motion.div>
      </section>


      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">


        <motion.div
          initial={{ x: -120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">
            Send Us a Message
          </h2>
          <p className="text-gray-300 mb-10">
            Have questions? Feedback? Partnership ideas?  
            Our team responds within 24 hours.
          </p>

          <div className="flex gap-5">
            {[Instagram, Facebook, Linkedin, Twitter].map((Icon, i) => (
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                key={i}
                className="p-4 rounded-xl bg-[#0b2a55] hover:bg-yellow-400 hover:text-black transition"
              >
                <Icon />
              </motion.button>
            ))}
          </div>
        </motion.div>


        <motion.form
          onSubmit={handleSubmit}
          initial={{ x: 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-white text-black rounded-2xl p-10 shadow-2xl space-y-6"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full border px-4 py-3 rounded-lg"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="w-full border px-4 py-3 rounded-lg"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Your Message"
            className="w-full border px-4 py-3 rounded-lg"
          />

          <button
            className="w-full flex justify-center items-center gap-2
                       bg-yellow-400 hover:bg-yellow-500
                       font-semibold py-3 rounded-lg transition"
          >
            <Send size={18} /> Send Message
          </button>
        </motion.form>
      </section>


      <section className="bg-[#071a33] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-14 flex justify-center items-center gap-2">
            <Users /> Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {["Karthikeyan", "Karthick", "Karthikeyan"].map((name, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.05 }}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#0b2a55] rounded-2xl p-8 shadow-xl border-b-4 border-yellow-400"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 mb-4" />
                <h3 className="font-semibold">{name}</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Full Stack Developer
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}