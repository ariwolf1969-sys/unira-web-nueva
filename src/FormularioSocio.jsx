import { useState } from 'react';
import { supabase } from './supabaseClient';

function FormularioSocio() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', telefono: '', ciudad: '', provincia: '', nacionalidad: '', email: '',
    vehiculo: '', marca_modelo: '', mas_vehiculos: '', apps_actuales: [], nivel_estudios: '', profesion: '', idiomas: '',
    horas_dia: '', dias_semana: '', ingreso_mensual: '', vivienda: '', llega_comodo: '',
    problema_principal: [], otro_problema: '', seguridad_uber: '', seguridad_didi: '', seguridad_cabify: '', seguridad_indrive: '', situaciones_inseguridad: '',
    tiempo_perdido: '', solucion_tiempo: '', distancia_busqueda: '', distancia_maxima: '', funciones_app: [], mejora_clave: '', prioridades: '', votar_decisiones: '',
    interes_5: '', aporte_mensual: '', socio_fundador: '', cuando_comenzar: '', dudas: ''
  });

  const [dniFrente, setDniFrente] = useState(null);
  const [dniDorso, setDniDorso] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let arr = formData[name] ? [...formData[name]] : [];
      if (checked) { arr.push(value); } else { arr = arr.filter(item => item !== value); }
      setFormData({ ...formData, [name]: arr });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dniFrente || !dniDorso) { setMessage('Debés subir la foto del frente y dorso del DNI.'); return; }
    
    setLoading(true);
    setMessage('');

    try {
      const fileExtF = dniFrente.name.split('.').pop();
      const fileNameF = `${Date.now()}_frente.${fileExtF}`;
      const { error: errorF } = await supabase.storage.from('dni-bucket').upload(fileNameF, dniFrente);
      if (errorF) throw errorF;

      const fileExtD = dniDorso.name.split('.').pop();
      const fileNameD = `${Date.now()}_dorso.${fileExtD}`;
      const { error: errorD } = await supabase.storage.from('dni-bucket').upload(fileNameD, dniDorso);
      if (errorD) throw errorD;

      const dataToInsert = { ...formData };
      // Convertir arrays a texto separado por comas para la base de datos
      Object.keys(dataToInsert).forEach(key => {
        if (Array.isArray(dataToInsert[key])) {
          dataToInsert[key] = dataToInsert[key].join(', ');
        }
      });

      const { error: insertError } = await supabase.from('socios_potenciales').insert([{
        ...dataToInsert,
        dni_frente_url: fileNameF, 
        dni_dorso_url: fileNameD, 
        verificado: false
      }]);
      
      if (insertError) throw insertError;

      setMessage('¡Registro exitoso! Revisaremos tu DNI y nos pondremos en contacto.');
      setStep(6); // Paso de éxito
    } catch (error) {
      setMessage('Error al enviar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section light-bg">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1>Formulario de Asociación - Cooperativa Unira</h1>
        <p className="intro-text dark-text">🚨 BUSCAMOS 5.000 CONDUCTORES FUNDADORES. Las apps actuales te sacan hasta el 40%. Aquí pagarías solo 5% y serías un SOCIO REAL. Esto no es una simple encuesta, es para construir NUESTRA app.</p>
        
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Identidad</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Perfil</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Ingresos</div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Seguridad</div>
          <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>5. Compromiso</div>
        </div>

        <div className="info-block">
          <form onSubmit={handleSubmit}>
            
            {/* PASO 1: IDENTIDAD Y DNI */}
            {step === 1 && (
              <div className="form-step">
                <h3>Sección 1 — Datos Básicos y Verificación</h3>
                <div className="form-group"><label>Nombres y Apellidos *</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
                <div className="grid-2" style={{gap: '20px'}}>
                  <div className="form-group"><label>Teléfono (WhatsApp) *</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                </div>
                <div className="grid-2" style={{gap: '20px'}}>
                  <div className="form-group"><label>Ciudad *</label><input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Provincia *</label><input type="text" name="provincia" value={formData.provincia} onChange={handleChange} required /></div>
                </div>
                <div className="form-group"><label>Nacionalidad *</label><input type="text" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} required /></div>
                <div className="grid-2" style={{gap: '20px'}}>
                  <div className="form-group"><label>Foto DNI Frente * (Verificación)</label><input type="file" accept="image/*" onChange={(e) => setDniFrente(e.target.files[0])} required /></div>
                  <div className="form-group"><label>Foto DNI Dorso * (Verificación)</label><input type="file" accept="image/*" onChange={(e) => setDniDorso(e.target.files[0])} required /></div>
                </div>
                <div style={{textAlign: 'right', marginTop: '20px'}}><button type="button" className="cta-button primary" onClick={nextStep}>Siguiente</button></div>
              </div>
            )}

            {/* PASO 2: PERFIL CONDUCTOR */}
            {step === 2 && (
              <div className="form-step">
                <h3>Sección 2 — Perfil del Conductor</h3>
                <div className="form-group">
                  <label>¿Qué vehículo/s utilizás? *</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" name="vehiculo" value="Auto" checked={formData.vehiculo.includes('Auto')} onChange={handleChange} /> Auto</label>
                    <label><input type="checkbox" name="vehiculo" value="Moto" checked={formData.vehiculo.includes('Moto')} onChange={handleChange} /> Moto</label>
                    <label><input type="checkbox" name="vehiculo" value="Bicicleta" checked={formData.vehiculo.includes('Bicicleta')} onChange={handleChange} /> Bicicleta</label>
                    <label><input type="checkbox" name="vehiculo" value="No tengo" checked={formData.vehiculo.includes('No tengo')} onChange={handleChange} /> No tengo</label>
                  </div>
                </div>
                <div className="form-group"><label>Si tenés auto, añadir Marca y Modelo</label><input type="text" name="marca_modelo" value={formData.marca_modelo} onChange={handleChange} /></div>
                <div className="form-group"><label>¿Tenés más de un vehículo? Detallá</label><input type="text" name="mas_vehiculos" value={formData.mas_vehiculos} onChange={handleChange} /></div>
                <div className="form-group">
                  <label>¿En qué apps trabajás?</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" name="apps_actuales" value="Uber" onChange={handleChange} /> Uber</label>
                    <label><input type="checkbox" name="apps_actuales" value="Didi" onChange={handleChange} /> Didi</label>
                    <label><input type="checkbox" name="apps_actuales" value="Cabify" onChange={handleChange} /> Cabify</label>
                    <label><input type="checkbox" name="apps_actuales" value="InDrive" onChange={handleChange} /> InDrive</label>
                  </div>
                </div>
                <div className="form-group"><label>Nivel de Estudios alcanzados / Conocimientos *</label><input type="text" name="nivel_estudios" value={formData.nivel_estudios} onChange={handleChange} required /></div>
                <div className="form-group"><label>Profesión... (Ej: Electricista - Chofer - Desarrollador) *</label><input type="text" name="profesion" value={formData.profesion} onChange={handleChange} required /></div>
                <div className="form-group"><label>Idiomas? *</label><input type="text" name="idiomas" value={formData.idiomas} onChange={handleChange} required /></div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <button type="button" className="cta-button secondary" onClick={prevStep} style={{color: '#333', borderColor: '#ccc'}}>Anterior</button>
                  <button type="button" className="cta-button primary" onClick={nextStep}>Siguiente</button>
                </div>
              </div>
            )}

            {/* PASO 3: INGRESOS Y SITUACION */}
            {step === 3 && (
              <div className="form-step">
                <h3>Sección 3 — Ingresos y Situación</h3>
                <div className="form-group">
                  <label>¿Cuántas horas trabajás por día? *</label>
                  <select name="horas_dia" value={formData.horas_dia} onChange={handleChange} required>
                    <option value="">Seleccionar...</option><option value="Menos de 6">Menos de 6</option><option value="6 a 8">6 a 8</option><option value="8 a 10">8 a 10</option><option value="10 a 12">10 a 12</option><option value="Más de 12">Más de 12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Cuántos días trabajás por semana? *</label>
                  <select name="dias_semana" value={formData.dias_semana} onChange={handleChange} required>
                    <option value="">Seleccionar...</option><option value="1 a 3">1 a 3</option><option value="4 a 5">4 a 5</option><option value="6">6</option><option value="7">7</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Cuánto generás por mes aproximadamente? *</label>
                  <select name="ingreso_mensual" value={formData.ingreso_mensual} onChange={handleChange} required>
                    <option value="">Seleccionar...</option><option value="Menos de $1M">Menos de $1.000.000</option><option value="$1M - $1.5M">$1.000.000 – $1.500.000</option><option value="$1.5M - $2M">$1.500.000 – $2.000.000</option><option value="$2M - $2.5M">$2.000.000 – $2.500.000</option><option value="$2.5M - $3M">$2.500.000 – $3.000.000</option><option value="Más de $3M">Más de $3.000.000</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Tu situación de vivienda es? *</label>
                  <select name="vivienda" value={formData.vivienda} onChange={handleChange} required>
                    <option value="">Seleccionar...</option><option value="Propietario">Propietario</option><option value="Alquilo">Alquilo</option><option value="Vivo con familiares">Vivo con familiares o Amigos</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Llegás cómodo a fin de mes? *</label>
                  <select name="llega_comodo" value={formData.llega_comodo} onChange={handleChange} required>
                    <option value="">Seleccionar...</option><option value="Si">Si</option><option value="No">No</option><option value="Mas o Menos">Mas o Menos</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>¿Cuál es tu principal problema hoy? *</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" name="problema_principal" value="Comisiones altas" onChange={handleChange} /> Comisiones altas</label>
                    <label><input type="checkbox" name="problema_principal" value="Tarifas bajas" onChange={handleChange} /> Tarifas bajas</label>
                    <label><input type="checkbox" name="problema_principal" value="Falta de viajes" onChange={handleChange} /> Falta de viajes</label>
                    <label><input type="checkbox" name="problema_principal" value="Gastos del vehículo" onChange={handleChange} /> Gastos del vehículo</label>
                  </div>
                </div>
                <div className="form-group"><label>¿Qué otro problema estás teniendo?</label><input type="text" name="otro_problema" value={formData.otro_problema} onChange={handleChange} /></div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <button type="button" className="cta-button secondary" onClick={prevStep} style={{color: '#333', borderColor: '#ccc'}}>Anterior</button>
                  <button type="button" className="cta-button primary" onClick={nextStep}>Siguiente</button>
                </div>
              </div>
            )}

            {/* PASO 4: EXPERIENCIA Y SEGURIDAD */}
            {step === 4 && (
              <div className="form-step">
                <h3>Sección 4 — Experiencia Real y Seguridad</h3>
                <div className="form-group">
                  <label>¿Qué tan seguro te sentís trabajando con UBER? *</label>
                  <select name="seguridad_uber" value={formData.seguridad_uber} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Muy seguro">Muy seguro</option><option value="Bastante seguro">Bastante seguro</option><option value="Poco seguro">Poco seguro</option><option value="Nada seguro">Nada seguro</option></select>
                </div>
                <div className="form-group">
                  <label>¿Qué tan seguro te sentís trabajando con DIDI? *</label>
                  <select name="seguridad_didi" value={formData.seguridad_didi} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Muy seguro">Muy seguro</option><option value="Bastante seguro">Bastante seguro</option><option value="Poco seguro">Poco seguro</option><option value="Nada seguro">Nada seguro</option></select>
                </div>
                <div className="form-group">
                  <label>¿Qué tan seguro te sentís trabajando con CABIFY? *</label>
                  <select name="seguridad_cabify" value={formData.seguridad_cabify} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Muy seguro">Muy seguro</option><option value="Bastante seguro">Bastante seguro</option><option value="Poco seguro">Poco seguro</option><option value="Nada seguro">Nada seguro</option></select>
                </div>
                <div className="form-group">
                  <label>¿Qué tan seguro te sentís trabajando con INDRIVE? *</label>
                  <select name="seguridad_indrive" value={formData.seguridad_indrive} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Muy seguro">Muy seguro</option><option value="Bastante seguro">Bastante seguro</option><option value="Poco seguro">Poco seguro</option><option value="Nada seguro">Nada seguro</option></select>
                </div>
                <div className="form-group"><label>¿Qué situaciones de inseguridad viviste o te preocupan?</label><textarea name="situaciones_inseguridad" rows="3" value={formData.situaciones_inseguridad} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0'}}></textarea></div>
                
                <h4 style={{marginTop: '20px'}}>⏱️ Tiempo perdido</h4>
                <div className="form-group">
                  <label>¿Cuánto te afecta que los pasajeros demoren en subir al vehículo? *</label>
                  <select name="tiempo_perdido" value={formData.tiempo_perdido} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Mucho">Mucho</option><option value="Bastante">Bastante</option><option value="Poco">Poco</option><option value="Nada">Nada</option></select>
                </div>
                <div className="form-group"><label>¿Qué solución te gustaría para este problema?</label><input type="text" name="solucion_tiempo" value={formData.solucion_tiempo} onChange={handleChange} /></div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <button type="button" className="cta-button secondary" onClick={prevStep} style={{color: '#333', borderColor: '#ccc'}}>Anterior</button>
                  <button type="button" className="cta-button primary" onClick={nextStep}>Siguiente</button>
                </div>
              </div>
            )}

            {/* PASO 5: COMPROMISO Y APP */}
            {step === 5 && (
              <div className="form-step">
                <h3>Sección 5 — Interés, Compromiso y Mejoras</h3>
                
                <div className="form-group">
                  <label>📍 ¿Te gustaría poder elegir la distancia máxima para buscar pasajeros? *</label>
                  <select name="distancia_busqueda" value={formData.distancia_busqueda} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Si">Si</option><option value="No">No</option><option value="Me da igual">Me da igual</option></select>
                </div>
                <div className="form-group">
                  <label>¿Qué distancia máxima elegirías?</label>
                  <select name="distancia_maxima" value={formData.distancia_maxima} onChange={handleChange}><option value="">Seleccionar...</option><option value="Menos de 1 km">Menos de 1 km</option><option value="1 a 3 km">1 a 3 km</option><option value="3 a 5 km">3 a 5 km</option><option value="Más de 5 km">Más de 5 km</option></select>
                </div>
                <div className="form-group">
                  <label>¿Qué te gustaría que tenga una nueva app para trabajar más a gusto?</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" name="funciones_app" value="Menor comisión" onChange={handleChange} /> Menor comisión</label>
                    <label><input type="checkbox" name="funciones_app" value="Mejores tarifas" onChange={handleChange} /> Mejores tarifas</label>
                    <label><input type="checkbox" name="funciones_app" value="Mayor seguridad" onChange={handleChange} /> Mayor seguridad</label>
                    <label><input type="checkbox" name="funciones_app" value="Menos tiempo de espera" onChange={handleChange} /> Menos tiempo de espera</label>
                    <label><input type="checkbox" name="funciones_app" value="Mejor soporte" onChange={handleChange} /> Mejor soporte</label>
                  </div>
                </div>
                <div className="form-group"><label>⭐ Si pudieras elegir UNA mejora principal, ¿cuál sería?</label><input type="text" name="mejora_clave" value={formData.mejora_clave} onChange={handleChange} /></div>
                <div className="form-group"><label>⚙️ ¿Qué mejorarías sí o sí?</label><input type="text" name="prioridades" value={formData.prioridades} onChange={handleChange} /></div>
                <div className="form-group">
                  <label>¿Te gustaría poder votar decisiones dentro de la app como socio? *</label>
                  <select name="votar_decisiones" value={formData.votar_decisiones} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Si">Si</option><option value="No">No</option></select>
                </div>

                <h4 style={{marginTop: '20px'}}>Interés y Compromiso</h4>
                <div className="form-group">
                  <label>¿Te interesaría participar en una app con solo 5% de comisión? *</label>
                  <select name="interes_5" value={formData.interes_5} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Si">Si</option><option value="No">No</option><option value="Quiero mas info">Quiero más información</option></select>
                </div>
                <div className="form-group">
                  <label>¿Estarías dispuesto a aportar USD 20 (Aprox. $30.000) mensuales durante 12 meses? *</label>
                  <select name="aporte_mensual" value={formData.aporte_mensual} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Si">Si</option><option value="No">No</option></select>
                </div>
                <div className="form-group">
                  <label>¿Te gustaría participar como socio fundador? *</label>
                  <select name="socio_fundador" value={formData.socio_fundador} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Si, quiero participar">Sí, quiero participar</option><option value="No por ahora">No por ahora</option><option value="Quiero entender mejor">Quiero entender mejor cómo funciona</option><option value="Me interesa pero necesito mas info">Me interesa pero necesito más información</option></select>
                </div>
                <div className="form-group">
                  <label>¿Cuándo estarías dispuesto a comenzar? *</label>
                  <select name="cuando_comenzar" value={formData.cuando_comenzar} onChange={handleChange} required><option value="">Seleccionar...</option><option value="Inmediatamente">Inmediatamente</option><option value="En 1 mes">En 1 mes</option><option value="Mas adelante">Más adelante</option><option value="Solo estoy evaluando">Solo estoy evaluando</option></select>
                </div>
                <div className="form-group"><label>¿Qué necesitás entender mejor o qué dudas tenés?</label><textarea name="dudas" rows="3" value={formData.dudas} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0'}}></textarea></div>

                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <button type="button" className="cta-button secondary" onClick={prevStep} style={{color: '#333', borderColor: '#ccc'}}>Anterior</button>
                  <button type="submit" className="cta-button primary" disabled={loading}>
                    {loading ? 'Enviando y verificando...' : 'Enviar Solicitud Completa'}
                  </button>
                </div>
                {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: message.includes('Error') ? 'red' : '#4fd1c5' }}>{message}</p>}
              </div>
            )}

            {/* PANTALLA DE ÉXITO */}
            {step === 6 && (
              <div className="form-step" style={{textAlign: 'center'}}>
                <h2 style={{color: '#4fd1c5'}}>¡Gracias, {formData.nombre}!</h2>
                <p style={{fontSize: '1.2rem', marginTop: '20px'}}>Hemos recibido tu solicitud completa y fotos del DNI. Nuestro equipo va a verificar tu identidad y se pondrá en contacto contigo por WhatsApp.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioSocio;