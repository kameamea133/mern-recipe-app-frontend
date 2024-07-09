import { motion } from "framer-motion";

const Hero = () => {

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <motion.div 
    initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.35,
          },
        },
      }}
    className='heroContainer'>
    <div className="overlay"/>
        <img src="https://images.pexels.com/photos/1435894/pexels-photo-1435894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
        <div className="text-overlay">
    <motion.h1
     variants={FADE_DOWN_ANIMATION_VARIANTS}
    ><span>SavorySecrets </span>Cook & Share</motion.h1>
    <motion.p
    variants={FADE_DOWN_ANIMATION_VARIANTS}
    >Your Favorite Destination to Discover and Share Delicious Recipes</motion.p>
  </div>
    </motion.div>
  )
}

export default Hero