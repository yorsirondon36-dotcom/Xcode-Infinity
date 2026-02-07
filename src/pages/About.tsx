import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/whatsapp_image_2026-02-07_at_2.10.22_am.jpeg',
    '/whatsapp_image_2026-02-07_at_2.10.45_am.jpeg',
    '/whatsapp_image_2026-02-07_at_2.11.04_am.jpeg',
    '/whatsapp_image_2026-02-07_at_2.15.21_am.jpeg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Sobre Nosotros</h1>
      </div>

      <div className="px-4 py-8 max-w-3xl mx-auto">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-purple-800">
          <div className="relative w-full h-96 sm:h-[500px]">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-400/80 hover:bg-yellow-400 text-purple-900 p-2 rounded-full transition-colors z-10"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400/80 hover:bg-yellow-400 text-purple-900 p-2 rounded-full transition-colors z-10"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-yellow-400 w-8'
                    : 'bg-yellow-400/50 hover:bg-yellow-400/75 w-3'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 bg-purple-900/75 px-3 py-1 rounded-full text-yellow-400 text-sm font-semibold">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Nuestra Misión</h2>
            <p className="text-purple-200 leading-relaxed">
              Somos una comunidad dedicada a crear oportunidades de emprendimiento y crecimiento financiero.
              Nuestro objetivo es empoderar a cada miembro para alcanzar sus metas económicas a través de
              sistemas innovadores y sostenibles.
            </p>
          </section>

          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Nuestra Visión</h2>
            <p className="text-purple-200 leading-relaxed">
              Crear un ecosistema global donde los emprendedores puedan colaborar, crecer y prosperar juntos.
              Creemos en la transparencia, la confianza y el éxito mutuo como pilares fundamentales de nuestro proyecto.
            </p>
          </section>

          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">¿Por Qué Elegirnos?</h2>
            <ul className="text-purple-200 space-y-2">
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">✓</span>
                <span>Plataforma segura y confiable</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">✓</span>
                <span>Comisiones competitivas y transparentes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">✓</span>
                <span>Soporte dedicado 24/7</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">✓</span>
                <span>Herramientas y recursos para el éxito</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">✓</span>
                <span>Comunidad activa y solidaria</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
