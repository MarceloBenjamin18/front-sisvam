import React, { useState, useRef, useEffect, useCallback } from "react";

// Simulamos los componentes de Material Tailwind
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };
  
  return (
    <div className={`${sizeClasses[size]} bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold ${className}`}>
      {alt?.charAt(0) || "U"}
    </div>
  );
};

const Typography = ({ variant = "p", children, className = "", color = "blue-gray" }) => {
  const variants = {
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold", 
    h5: "text-lg font-medium",
    h6: "text-base font-semibold",
    lead: "text-lg",
    small: "text-sm",
    p: "text-base"
  };
  
  const colors = {
    "blue-gray": "text-gray-700",
    white: "text-white"
  };
  
  const Tag = variant.startsWith('h') ? variant : 'p';
  
  return (
    <Tag className={`${variants[variant]} ${colors[color] || colors["blue-gray"]} ${className}`}>
      {children}
    </Tag>
  );
};

const Chip = ({ value, color = "blue", size = "md", className = "" }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {value}
    </span>
  );
};

const Button = ({ children, color = "blue", variant = "filled", size = "md", className = "", onClick }) => {
  const baseClasses = "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors";
  const colorClasses = {
    blue: variant === "outlined" ? "border border-blue-500 text-blue-500 hover:bg-blue-50" : "bg-blue-500 text-white hover:bg-blue-600",
    red: variant === "outlined" ? "border border-red-500 text-red-500 hover:bg-red-50" : "bg-red-500 text-white hover:bg-red-600"
  };
  
  return (
    <button className={`${baseClasses} ${colorClasses[color]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// Iconos simplificados
const KeyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const ArrowRightOnRectangleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

// Componente ScrollStack personalizado
const ScrollStackItem = ({ children, className = "" }) => (
  <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>
);

const ScrollStack = ({ 
  children, 
  className = "",
  itemDistance = 120,
  itemScale = 0.04,
  itemStackDistance = 25,
  stackPosition = "25%",
  scaleEndPosition = "15%",
  baseScale = 0.88,
  rotationAmount = 0 // Sin rotación para mantener centrado
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTransformsRef = useRef(new Map());

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const updateCardTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !cardsRef.current.length) return;

    const scrollTop = scroller.scrollTop;
    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElement = scroller.querySelector('.scroll-stack-end');
    const endElementTop = endElement ? endElement.offsetTop : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = card.offsetTop;
      const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + (i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: 0 // Sin rotación
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged = !lastTransform || 
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
        card.style.transform = transform;
        lastTransformsRef.current.set(i, newTransform);
      }
    });
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, calculateProgress, parsePercentage]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll(".scroll-stack-card"));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'center center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
    });

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    updateCardTransforms();

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, handleScroll, updateCardTransforms]);

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      }}
    >
      <div className="px-4 flex flex-col items-center" style={{ paddingTop: '15vh', paddingBottom: '50vh', minHeight: '100vh' }}>
        <div className="w-full max-w-2xl">
          {children}
        </div>
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default function EmptyProfilePanels() {
  const [selectedSection, setSelectedSection] = useState(1);
  
  // Simulamos 107 valores divididos en secciones
  const totalValues = 107;
  const valuesPerSection = 10;
  const totalSections = Math.ceil(totalValues / valuesPerSection);
  
  // Creamos las secciones
  const sections = Array.from({ length: totalSections }, (_, sectionIndex) => {
    const startIndex = sectionIndex * valuesPerSection + 1;
    const endIndex = Math.min(startIndex + valuesPerSection - 1, totalValues);
    const sectionValues = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i);
    
    return {
      id: sectionIndex + 1,
      title: `Sección ${sectionIndex + 1}`,
      description: `Valores del ${startIndex} al ${endIndex}`,
      values: sectionValues,
      color: [
        'from-blue-500 to-blue-600',
        'from-emerald-500 to-emerald-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-rose-500 to-rose-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
        'from-amber-500 to-amber-600',
        'from-cyan-500 to-cyan-600',
        'from-pink-500 to-pink-600',
        'from-lime-500 to-lime-600'
      ][sectionIndex % 11],
      bgColor: [
        '#f8fafc', '#f0fdf4', '#fdf4ff', '#fff7ed', '#fdf2f8', 
        '#f0f9ff', '#f0fdfa', '#fffbeb', '#ecfeff', '#fdf2f8', '#f7fee7'
      ][sectionIndex % 11]
    };
  });

  const currentSection = sections.find(s => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-blue-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Panel superior con degradado */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl z-10">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <Typography variant="h2" color="white" className="font-extrabold mb-1">
              Valores Municipales
            </Typography>
            <Typography variant="lead" color="white" className="opacity-90 max-w-xl">
              Sistema SISVAM 2.0 - Gestión de Valores Municipales
            </Typography>
          </div>
        </div>

        {/* Panel blanco principal */}
        <Card className="relative z-20 -translate-y-12 rounded-3xl shadow-lg border border-gray-200 bg-white/90 backdrop-blur-md">
          <CardBody className="p-6 md:p-8">

            {/* Sistema de Navegación por Secciones */}
            <div className="mt-6">
              {/* Header Principal */}
             

              {/* Selector de Secciones */}
              <div className="mb-6">
                

                {/* Selector dropdown - Vista móvil */}
                <div className="md:hidden mb-4">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium"
                  >
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title} - {section.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Información de la sección actual */}
                {currentSection && (
                  <div className={`bg-gradient-to-r ${currentSection.color} text-white rounded-2xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">
                          {currentSection.id}
                        </div>
                        <div>
                          <Typography variant="h6" color="white" className="font-bold mb-1">
                            {currentSection.title}
                          </Typography>
                          <div className="text-white/90 text-sm">
                            {currentSection.description} • {currentSection.values.length} documentos
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex items-center gap-4 text-white/10 text-sm">
                        <div className="text-center">
                          <div className="text-white font-semibold">{currentSection.values.length}</div>
                          <div>Elementos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">
                            {Math.floor(Math.random() * 50 + 10)} MB
                          </div>
                          <div>Tamaño</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">100%</div>
                          <div>Completo</div>
                        </div>
                      </div>
                    </div>

                    {/* Navegación rápida */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <button
                        onClick={() => setSelectedSection(Math.max(1, selectedSection - 1))}
                        disabled={selectedSection === 1}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedSection === 1 
                            ? 'text-white/50 cursor-not-allowed' 
                            : 'text-white bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </button>

                      <div className="text-white/90 text-sm">
                        Sección {selectedSection} de {totalSections}
                      </div>

                      <button
                        onClick={() => setSelectedSection(Math.min(totalSections, selectedSection + 1))}
                        disabled={selectedSection === totalSections}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedSection === totalSections 
                            ? 'text-white/50 cursor-not-allowed' 
                            : 'text-white bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        Siguiente
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ScrollStack de la sección actual */}
              {currentSection && (
                <div className="border border-gray-200 rounded-2xl bg-gradient-to-b from-gray-50 to-white h-[500px] overflow-hidden shadow-lg">
                  <ScrollStack className="h-full" key={`section-${currentSection.id}`}>
                    {currentSection.values.map((val, index) => (
                      <ScrollStackItem key={val}>
                        <div 
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-72 transform-gpu"
                          style={{
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            background: `linear-gradient(135deg, ${currentSection.bgColor}, white)`
                          }}
                        >
                          {/* Header del documento */}
                          <div className={`bg-gradient-to-r ${currentSection.color} p-4 flex items-center gap-3`}>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Typography variant="h6" color="white" className="font-bold truncate">
                                Valor Municipal #{val.toString().padStart(3, '0')}
                              </Typography>
                              <div className="text-white/80 text-sm">
                                {currentSection.title} • {Math.floor(Math.random() * 500 + 100)} KB
                              </div>
                            </div>
                            <div className="text-white/90 text-xs bg-white/20 px-2 py-1 rounded-full">
                              v2.{Math.floor(Math.random() * 10)}
                            </div>
                          </div>
                          
                          {/* Contenido del documento */}
                          <div className="p-5 h-full">
                            <div className="mb-3">
                              <Typography className="text-gray-700 font-semibold mb-2 text-sm">
                                Documento Municipal - {currentSection.title}
                              </Typography>
                              <Typography className="text-gray-600 text-xs leading-relaxed mb-3">
                                Valor municipal #{val} perteneciente a la {currentSection.title.toLowerCase()}. 
                                Contiene regulaciones específicas, tarifas municipales y procedimientos 
                                administrativos del sistema SISVAM 2.0 para esta categoría.
                              </Typography>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Estado</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                  <span className="text-xs font-medium text-gray-700">Activo</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Prioridad</div>
                                <span className="text-xs font-medium text-gray-700">
                                  {['Alta', 'Media', 'Baja'][index % 3]}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Tipo</div>
                                <span className="text-xs font-medium text-gray-700">Municipal</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>#{val}</span>
                                <span>•</span>
                                <span>Sec. {currentSection.id}</span>
                                <span>•</span>
                                <span>Hoy</span>
                              </div>
                              
                              <div className="flex gap-1">
                                <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollStackItem>
                    ))}
                  </ScrollStack>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}