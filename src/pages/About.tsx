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

          <section className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 rounded-xl p-8 border-2 border-orange-400">
            <h2 className="text-3xl font-bold text-orange-400 mb-4">Excode-Infinity & Disney × Pixar</h2>
            <h3 className="text-xl font-semibold text-yellow-400 mb-6">Entrando al Mercado Colombiano</h3>
            <p className="text-purple-200 leading-relaxed">
              Excode-Infinity es una empresa especializada en sistemas de evaluación y calificación de contenido audiovisual, con experiencia probada en plataformas de streaming internacionales. Hoy, anunciamos nuestra llegada al mercado colombiano con un proyecto estratégico en alianza con The Walt Disney Company, enfocado en el análisis y calificación de trailers cinematográficos, con el objetivo claro de impulsar los ingresos del talento local y fortalecer la industria audiovisual nacional.
            </p>
          </section>

          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Nuestro Sistema y Experiencia Previa</h2>
            <p className="text-purple-200 leading-relaxed mb-5">
              Nuestro sistema de calificación de trailers se basa en algoritmos avanzados combinados con evaluación humana especializada, diseñado para optimizar el impacto de contenido promocional en audiencias específicas. Durante los últimos 3 años, hemos implementado esta solución en plataformas de streaming de renombre en América del Norte y Europa, logrando:
            </p>
            <ul className="text-purple-200 space-y-3">
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">★</span>
                <span>Mejoras de hasta un 28% en la tasa de conversión de visualizaciones de trailers a reproducciones de películas.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">★</span>
                <span>Optimización de procesos que reduce tiempos de calificación en un 40%.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">★</span>
                <span>Integración fluida con sistemas de gestión de contenido de empresas líderes del sector.</span>
              </li>
            </ul>
          </section>

          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Oportunidad para el Personal Colombiano</h2>
            <p className="text-purple-200 leading-relaxed mb-5">
              La entrada al mercado colombiano tiene como pilar central el desarrollo del talento local. Nuestro modelo propone:
            </p>
            <ul className="text-purple-200 space-y-3">
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span><strong className="text-yellow-300">Ingresos competitivos:</strong> Remuneraciones por encima del promedio del sector audiovisual colombiano, con escalas salariales que reconocen la experiencia y el desempeño.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span><strong className="text-yellow-300">Capacitación especializada:</strong> Programas de formación en metodologías de calificación Disney y herramientas tecnológicas propias de nuestra plataforma audiovisual, certificados internacionalmente.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span><strong className="text-yellow-300">Oportunidades de crecimiento:</strong> Vías claras de promoción hacia roles de coordinación y liderazgo, con proyección a proyectos internacionales.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-400 font-bold">✓</span>
                <span><strong className="text-yellow-300">Trabajo flexible:</strong> Adaptado a las necesidades del personal, con opciones de modalidad híbrida que combinan trabajo remoto y ayuda a tus ingresos mensuales como teletrabajo.</span>
              </li>
            </ul>
          </section>

          <section className="bg-purple-800/50 rounded-xl p-6 border border-purple-700">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Impacto en el Mercado Colombiano</h2>
            <p className="text-purple-200 leading-relaxed mb-5">
              Este proyecto no solo beneficiará directamente al personal contratado, sino que también contribuirá al fortalecimiento de la industria audiovisual nacional:
            </p>
            <ul className="text-purple-200 space-y-3">
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">▸</span>
                <span>Transferencia de conocimientos y tecnologías de vanguardia.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">▸</span>
                <span>Creación de sinergias con empresas locales de postproducción y marketing cinematográfico.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">▸</span>
                <span>Impulso a la cultura del análisis de datos aplicado al contenido audiovisual en Colombia.</span>
              </li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-6 border-2 border-yellow-400">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Próximos Pasos</h2>
            <p className="text-purple-200 leading-relaxed">
              En los próximos meses fortaleceremos el rendimiento económico. Durante el año 2026 nos consolidamos como tu mejor aliado económico. Juntos lograremos mejores oportunidades de ingresos diarios y un crecimiento sostenible para toda nuestra comunidad.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
