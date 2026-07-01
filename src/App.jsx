import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid } from 'recharts';
import './App.css';
import logo from './assets/logo.png'; 
import FormularioSocio from './FormularioSocio';
import { supabase } from './supabaseClient';

const Navbar = () => (
  <nav className="navbar">
    <div className="nav-logo-container">
      <img src={logo} alt="Unira" className="nav-logo" />
      <Link to="/" className="nav-brand">UNIRA</Link>
    </div>
    <ul className="nav-links">
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/acerca">Acerca de</Link></li>
      <li><Link to="/cooperativa">Cooperativa</Link></li>
      <li><Link to="/finanzas">Finanzas</Link></li>
      <li><Link to="/trabaja">Trabaja con Nosotros</Link></li>
      <li><Link to="/contacto">Contacto</Link></li>
    </ul>
  </nav>
);

// Contador Regresivo - Fecha fija para que no falle (1 de Diciembre de 2026)
const launchDate = new Date('2026-12-01T00:00:00');

const calculateTimeLeft = () => {
  const now = new Date();
  const difference = launchDate - now;
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

// PAGINA INICIO
const Inicio = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [visitas, setVisitas] = useState(863); // Iniciamos con tu base

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  // Lógica del contador de visitas
  useEffect(() => {
    const countViews = async () => {
      const hasVisited = localStorage.getItem('unira_visited');
      const { data } = await supabase.from('site_stats').select('total_views').eq('id', 1).single();
      
      if (data) {
        if (!hasVisited) {
          localStorage.setItem('unira_visited', 'true');
          const newCount = data.total_views + 1;
          await supabase.from('site_stats').update({ total_views: newCount }).eq('id', 1);
          setVisitas(newCount);
        } else {
          setVisitas(data.total_views);
        }
      }
    };
    countViews();
  }, []);

  return (
    <div className="page-hero">
      <div className="container">
        <div className="logos-container">
          <img src={logo} alt="Cooperativa Unira" className="hero-logo" />
          <div className="teyevo-placeholder">TEYEVO</div>
        </div>
        <h1>Tomá el control de tu trabajo. Somos Socios Reales.</h1>
        <h2>Unira es la cooperativa que crea Teyevo, la app argentina donde el dinero se queda en tu bolsillo.</h2>
        
        <p className="hero-description">Comisión del 5%, compras comunitarias, talleres propios y poder de decisión. El dinero se queda en Argentina y en tus bolsillos.</p>
        
        <div className="countdown-container">
          <h3>Faltan para el lanzamiento:</h3>
          <div className="countdown">
            <div className="time-box"><span>{timeLeft.days}</span><small>Días</small></div>
            <div className="time-box"><span>{timeLeft.hours}</span><small>Horas</small></div>
            <div className="time-box"><span>{timeLeft.minutes}</span><small>Minutos</small></div>
            <div className="time-box"><span>{timeLeft.seconds}</span><small>Segundos</small></div>
          </div>
        </div>

        <div className="buttons-container">
          <Link to="/postularse" className="cta-button primary">Unirme a la Cooperativa</Link>
          <a href="https://unira.vercel.app/" target="_blank" rel="noopener noreferrer" className="cta-button secondary">Ver App Demo</a>
        </div>

        <div className="visit-counter">👁️ {visitas} visitas al sitio</div>
      </div>
    </div>
  );
};

// ... (ACERCA DE, COOPERATIVA, FINANZAS, TRABAJA, CONTACTO - QUEDAN IGUAL, LOS PEGO DEBAJO PARA NO CORTAR)
const AcercaDe = () => (
  <div className="page-section light-bg">
    <div className="container">
      <h1>Acerca del Proyecto: Mucho más que una App</h1>
      <p className="intro-text dark-text">Este no es un proyecto más. Es un movimiento que va a cambiar la vida de más de un millón de argentinos. Estamos construyendo la primera Super App Argentina de propiedad cooperativa, donde quienes trabajan son los verdaderos dueños.</p>
      <div className="info-block full-width" style={{marginBottom: '40px'}}>
        <h3>El concepto de Super App Argentina</h3>
        <p>Actualmente, las aplicaciones móviles agrupan a más de 1.000.000 de trabajadores en Argentina. Nuestra meta inicial es reunir a apenas el 0.5% (5.000 socios) para arrancar. Comenzaremos con Teyevo, abarcando viajes en auto, moto y bicicleta, y delivery de alimentos. Pero esto es solo el inicio: en un futuro cercano incorporaremos la contratación de servicios (plomeros, electricistas, albañiles, etc.), nuestra propia billetera virtual, y muchas otras funcionalidades. Todo bajo un mismo ecosistema cooperativo.</p>
      </div>
      <div className="grid-2">
        <div className="info-block">
          <h3>Compras Comunitarias: El ahorro real en tu bolsillo</h3>
          <p>No nos limitamos a cobrar una comisión baja. El poder de la cooperativa está en la unión. Al comprar en volumen, conseguimos precios mayoristas que bajan tus costos de vida y de trabajo drásticamente.</p>
          <ul className="check-list">
            <li><strong>Insumos vehiculares:</strong> No cuesta lo mismo un bidón de 4 litros de aceite que comprar tambores de 200 litros. Neumáticos, repuestos y lubricantes al costo.</li>
            <li><strong>Alimentos y bienes básicos:</strong> Carne, lácteos, verduras y artículos de primera necesidad a precios de hipermercado mayorista directamente en tus galpones.</li>
            <li><strong>Este ahorro mensual licúa el aporte:</strong> Lo que ahorrás en compras supera ampliamente los $30.000 del aporte de socio.</li>
          </ul>
        </div>
        <div className="info-block">
          <h3>Convenios y Beneficios Reales</h3>
          <p>Al ser una cooperativa masiva, tendremos un poder de negociación enorme. Trabajaremos para cerrar acuerdos directos con empresas, como fabricantes de vehículos (BYD es una de nuestras opciones prioritarias para lograr precios y financiamientos exclusivos) y aseguradoras, para reducir drásticamente los costos de pólizas y ofrecer las mejores condiciones a nuestros socios.</p>
        </div>
      </div>
    </div>
  </div>
);

const CooperativaPage = () => {
  const comisionData = [
    { name: 'OTRAS Apps', comision: 40 },
    { name: 'Unira (Socio)', comision: 5 },
    { name: 'Unira (Externo)', comision: 8 }
  ];
  return (
    <div className="page-section dark-section">
      <div className="container">
        <h1 className="light-text">En OTRAS aplicaciones te llaman "Socio", decime... ¿cuáles son tus beneficios de esa sociedad?</h1>
        <p className="subtitulo-seccion light-sub">En Unira, la palabra Socio significa ser dueño. Un socio real tiene voz, voto y reparte las ganancias. Somos REALES, no solo de palabra.</p>
        <div className="grid-2">
          <div className="info-block dark-block">
            <h3>¿Qué es una Cooperativa?</h3>
            <p>Una asociación autónoma de personas que se unen de forma voluntaria para satisfacer sus necesidades y aspiraciones económicas, sociales y culturales comunes. A diferencia de una empresa tradicional, no pertenece a accionistas externos, sino que es de propiedad conjunta y se administra de manera democrática.</p>
            <ul className="check-list">
              <li><strong>Control democrático:</strong> Cada asociado tiene derecho a un solo voto, sin importar el capital aportado (1 miembro, 1 voto).</li>
              <li><strong>Ayuda mutua:</strong> Los socios se apoyan para obtener mejores condiciones comerciales y laborales.</li>
              <li><strong>Gestión participativa:</strong> Los excedentes se reinvierten o se distribuyen según el uso de los servicios, no al capital invertido.</li>
              <li><strong>Responsabilidad limitada:</strong> El riesgo financiero se limita al monto de las cuotas suscritas.</li>
            </ul>
          </div>
          <div className="info-block dark-block">
            <h3>No somos un Sindicato</h3>
            <p>Un sindicato es una organización democrática de trabajadores que se unen para defender sus intereses laborales, económicos y sociales. Su función principal es representar al colectivo de empleados <strong>frente a los empleadores o el Estado</strong>, buscando mejores salarios y condiciones dignas.</p>
            <p style={{marginTop: '15px'}}>En Unira, <strong>nosotros somos los dueños</strong>. No hay empleador contra el cual luchar. Nos organizamos para ser dueños de la herramienta de trabajo y gestionarlo democráticamente.</p>
          </div>
        </div>
        <div className="chart-wrapper dark-chart">
          <h3>Comparativa de Comisiones: ¿Cuánto se quedan por cada $100.000 que facturás?</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={comisionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip formatter={(value) => `$${value}.000`} />
                <Bar dataKey="comision" fill="#4fd1c5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-caption light-text">Mientras otras apps se quedan con el 40% (o más) de tu esfuerzo, Unira solo retiene el 5% a sus socios. Ese 5% es el motor para expandirnos, conseguir más socios, mejorar las condiciones de los conductores, financiar unidades a baja tasa, construir áreas de esparcimiento y mucho más. El 95% restante queda directamente en tu bolsillo.</p>
        </div>
        <div className="requisitos">
          <h3>¿Cómo ser Socio Fundador?</h3>
          <p>Aporte mensual de <strong>$30.000 ARS (Actualizables por valor UVA)</strong> durante 12 meses. Este aporte te da acceso a la comisión del 5%, talleres mecánicos y de chapa/pintura propios, compras comunitarias, financiamiento y voz y voto en la asamblea. Si no querés ser socio, podés usar la app pagando un 8% de comisión y sin acceso a los beneficios cooperativos.</p>
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Link to="/postularse" className="cta-button primary">Unirme a la Cooperativa</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanzasPage = () => {
  const distribucionData = [
    { name: 'Gastos Operativos', value: 116 },
    { name: 'Retorno a Socios (20%)', value: 125 },
    { name: 'Expansión y Recreación', value: 384 }
  ];
  const COLORS = ['#e53e3e', '#3182ce', '#4fd1c5'];
  const escalabilidadData = [
    { socios: '5.000', gananciaNeta: 509, gastos: 116 },
    { socios: '10.000', gananciaNeta: 980, gastos: 250 },
    { socios: '50.000', gananciaNeta: 4800, gastos: 1400 },
    { socios: '100.000', gananciaNeta: 9500, gastos: 3000 }
  ];
  return (
    <div className="page-section finance-bg">
      <div className="container">
        <h1>Transparencia Financiera Total</h1>
        <p className="subtitulo-seccion dark-text">Todos los valores están expresados en Pesos Argentinos (ARS), actualizados al valor del Dólar Oficial al día de la fecha. Los aportes se ajustan por UVA para proteger el fondo contra la inflación.</p>
        <div className="grid-2">
          <div className="finance-detail-card">
            <h4>Fase 1: Inversión Inicial Estimada</h4>
            <p className="finance-total">$398.000.000 ARS</p>
            <ul>
              <li>Desarrollo App Teyevo (Empresa de primer nivel): $50.000.000</li>
              <li>4 Galpones (Depósitos garantía y adecuación inicial): $65.000.000</li>
              <li>Equipamiento Talleres (8 grúas elevadoras + herramientas): $75.000.000</li>
              <li>Trámites Legales, INAES y Constitutivos: $8.000.000</li>
              <li>Capital de Trabajo y Contingencias Inicial: $200.000.000</li>
            </ul>
          </div>
          <div className="finance-detail-card">
            <h4>Marketing Inicial (Campaña 6 meses)</h4>
            <p className="finance-total">$218.000.000 ARS</p>
            <ul>
              <li>150 Lunetas de Colectivos (Alquiler 6 meses + impresión): $118.500.000</li>
              <li>Ploteo 2.500 Autos de Socios Iniciales: $87.500.000</li>
              <li>Campaña Digital Meta (Pauta + Agencia 6 meses): $12.000.000</li>
            </ul>
          </div>
        </div>
        <div className="finance-detail-card full-width">
          <h4>Gastos Operativos Mensuales (Base 5.000 Socios)</h4>
          <p className="finance-total">$116.360.000 ARS / mes</p>
          <ul className="grid-list">
            <li><strong>Sueldos Talleres + Cargas Sociales:</strong> $75.600.000</li>
            <li><strong>Sueldos Administración Central + Cargas:</strong> $11.760.000</li>
            <li><strong>Alquileres 4 Galpones y Oficina:</strong> $14.000.000</li>
            <li><strong>Servidores Cloud, Mapas, Pasarelas:</strong> $4.000.000</li>
            <li><strong>Servicios (Luz, internet, seguros):</strong> $11.000.000</li>
          </ul>
        </div>
        <div className="finance-note">
          <h3>Balance Año 1: ¿De dónde sale el dinero y cuánto nos queda?</h3>
          <div className="balance-grid">
            <div className="balance-column haber">
              <h4>HABER (Ingresos Año 1)</h4>
              <p>Aportes 5.000 socios x $30.000 x 12 meses: <strong>$1.800.000.000</strong></p>
              <p>Intereses estimados: <strong>+$200.000.000</strong></p>
              <p className="total-balance">Total Ingresos: <strong>$2.000.000.000</strong></p>
            </div>
            <div className="balance-column debe">
              <h4>DEBE (Egresos Año 1)</h4>
              <p>Inversión Inicial: <strong>$398.000.000</strong></p>
              <p>Marketing Lanzamiento: <strong>$218.000.000</strong></p>
              <p>Gastos Operativos (6 meses): <strong>$696.000.000</strong></p>
              <p className="total-balance">Total Egresos: <strong>$1.312.000.000</strong></p>
            </div>
          </div>
          <div className="reserva-box">
            <h4>RESERVA / SALDO A FAVOR DE LA COOPERATIVA A FIN DEL AÑO 1</h4>
            <p className="reserva-monto">$688.000.000 ARS</p>
            <p>Este dinero es el respaldo real para afrontar imprevistos y proyectar la compra de tierras para nuestros centros recreativos.</p>
          </div>
          <div className="chart-wrapper" style={{marginTop: '40px'}}>
            <h3 className="dark-text">Distribución mensual del 5% de comisión (5.000 socios)</h3>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={distribucionData} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {distribucionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}M`}/>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-caption dark-text">De los $625M mensuales: $116M Gastos, $125M Reparto a Socios, $384M Superávit.</p>
          </div>
          <div className="chart-wrapper" style={{marginTop: '40px'}}>
            <h3 className="dark-text">Escalabilidad Realista: Ingresos vs Estructura</h3>
            <p className="chart-caption dark-text" style={{marginBottom: '20px'}}>Al sumar socios, crecen los ingresos pero también los gastos. Igual, la ganancia neta escala exponencialmente.</p>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={escalabilidadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="socios" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gastos" fill="#e53e3e" name="Gastos Estructura" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="gananciaNeta" fill="#4fd1c5" name="Ganancia Neta" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="vision-recreativa">
            <h4>Nuestra Visión a Futuro: Centros Recreativos Propios</h4>
            <p>Con ese superávit, no solo expandiremos la app a todo el país. Comenzaremos construyendo <strong>Centros Recreativos</strong> en distintas provincias: piscinas, parrillas, juegos para niños, y canchas deportivas (fútbol, pádel, tenis). A mediano plazo, estos centros evolucionarán a complejos vacacionales casi gratuitos para los socios, y fomentaremos el intercambio de viviendas entre socios de distintas provincias.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrabajaConNosotros = () => (
  <div className="page-section light-bg">
    <div className="container">
      <h1>¿Querés trabajar en la Cooperativa Unira?</h1>
      <p className="intro-text dark-text">Para construir este proyecto gigante, necesitamos a los mejores profesionales. Buscamos personas comprometidas con el modelo cooperativo y que quieran crecer con nosotros desde el día cero.</p>
      <div className="grid-2">
        <div className="info-block">
          <h3>Búsquedas Abiertas</h3>
          <ul className="check-list">
            <li>Contadores (Con experiencia en cooperativas)</li>
            <li>Abogados (Especialistas en derecho cooperativo y laboral)</li>
            <li>Personal de RRHH</li>
            <li>Mecánicos y Electricistas Automotrices</li>
            <li>Chapistas y Pintores</li>
            <li>Soporte Técnico IT</li>
          </ul>
        </div>
        <div className="info-block">
          <h3>¿Cómo postularse?</h3>
          <p>Si te identificás con la visión de Unira y querés ser parte del equipo que va a revolucionar el trabajo en Argentina, envianos tu curriculum vitae.</p>
          <div style={{marginTop: '30px', textAlign: 'center'}}>
            <a href="mailto:rrhh@unira.com.ar" className="cta-button primary">Enviar CV a rrhh@unira.com.ar</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Contacto = () => (
  <div className="page-section contact-bg">
    <div className="container">
      <h1>Contacto General</h1>
      <p style={{marginBottom: '30px', fontSize: '1.2rem'}}>Tenes dudas? Escribinos.</p>
      <a href="mailto:contacto@unira.com.ar" className="cta-button primary">contacto@unira.com.ar</a>
    </div>
  </div>
);

// FOOTER
const Footer = () => (
  <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <img src={logo} alt="Unira" className="footer-logo" />
        <p>La primer super-app cooperativa de Argentina. La aplicación es de todos.</p>
      </div>
      <div className="footer-links">
        <h4>Navegación</h4>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/acerca">Acerca de</Link></li>
          <li><Link to="/cooperativa">Cooperativa</Link></li>
          <li><Link to="/finanzas">Finanzas</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Términos y Condiciones</a></li>
          <li><a href="#">Política de Privacidad</a></li>
          <li><a href="#">Política de Cookies</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 Unira. Todos los derechos reservados.</p>
      <div className="social-icons">
        <a href="https://www.facebook.com/groups/grupo.para.crear.nuestra.propia.aplicacion.movil" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">TT</a>
        <a href="https://t.me/+KyvTJJ_aZzAwNTMx" target="_blank" rel="noopener noreferrer" aria-label="Telegram">TG</a>
      </div>
    </div>
  </footer>
);


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/acerca" element={<AcercaDe />} />
          <Route path="/cooperativa" element={<CooperativaPage />} />
          <Route path="/finanzas" element={<FinanzasPage />} />
          <Route path="/trabaja" element={<TrabajaConNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/postularse" element={<FormularioSocio />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;