import { motion } from 'framer-motion'

const Projects = () => {
  return (
    <section id="projects" className="py-32 border-t border-white/10">
      <div className="max-w-screen-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <h2 className="text-2xl tracking-wider">PROJELER</h2>
          <div className="grid grid-cols-1 gap-16">
            {/* Proje kartları buraya gelecek */}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects 