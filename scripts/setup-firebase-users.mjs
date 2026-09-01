/**
 * Crea (o actualiza) cuentas REALES de Firebase Authentication para el
 * equipo de DevJos Studio, y les asigna su rol como "custom claim" del
 * token — así el backend puede verificar el rol sin ir a la base de datos
 * en cada petición.
 *
 * CÓMO CORRERLO (una sola vez, desde tu computadora, NO en Vercel):
 *
 *   1. En Firebase Console → Configuración del proyecto → Cuentas de
 *      servicio → "Generar nueva clave privada". Se descarga un .json.
 *   2. Guarda ese archivo como `service-account.json` en la raíz del
 *      proyecto (NO lo subas a git — ya está en .gitignore).
 *   3. En Firebase Console → Authentication → Sign-in method → activa
 *      "Correo electrónico/contraseña".
 *   4. Corre:  node scripts/setup-firebase-users.mjs
 *   5. El script imprime cada cuenta creada con una contraseña temporal.
 *      Compártela con cada persona por un canal seguro (no por email sin
 *      cifrar) y pídeles que la cambien apenas entren (Firebase permite
 *      "cambiar contraseña" desde el propio SDK del cliente).
 *
 * Puedes correrlo de nuevo cuando quieras — si el email ya existe, solo
 * actualiza el rol (custom claim), no crea una cuenta duplicada.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { randomBytes } from 'crypto';

const SERVICE_ACCOUNT_PATH = new URL('../service-account.json', import.meta.url);

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('\n❌ No encontré service-account.json en la raíz del proyecto.');
  console.error('   Descárgalo desde Firebase Console → Configuración del proyecto');
  console.error('   → Cuentas de servicio → Generar nueva clave privada.\n');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();

// Equipo actual (copiado de src/data/initialData.ts — sin contraseñas,
// esas ya no viven en el código).
const team = [
  { name: 'Josías Lachapelle', email: 'josias@devjosstudio.com', role: 'Administrador' },
  { name: 'Carlos Mendoza', email: 'carlos.dev@devjosstudio.com', role: 'Developer' },
  { name: 'Valeria Rivas', email: 'valeria.design@devjosstudio.com', role: 'Diseñador' },
  { name: 'David Ortiz', email: 'david.photo@devjosstudio.com', role: 'Fotógrafo' },
  { name: 'Andrea Morales', email: 'andrea.media@devjosstudio.com', role: 'Videógrafo' },
  { name: 'Marcos Peralta', email: 'marcos.finanzas@devjosstudio.com', role: 'Finanzas' },
  { name: 'Camila Peña', email: 'camila.social@devjosstudio.com', role: 'Contenido' },
];

function generateTempPassword() {
  return randomBytes(9).toString('base64').replace(/[+/=]/g, '').slice(0, 12);
}

async function upsertUser({ name, email, role }) {
  let user;
  let tempPassword = null;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`↻  Ya existe: ${email} (uid: ${user.uid}) — actualizando rol a '${role}'`);
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
    tempPassword = generateTempPassword();
    user = await auth.createUser({
      email,
      password: tempPassword,
      displayName: name,
      emailVerified: false,
    });
    console.log(`✅ Creado: ${email} (uid: ${user.uid})`);
  }

  await auth.setCustomUserClaims(user.uid, { role });

  return { name, email, role, uid: user.uid, tempPassword };
}

const results = [];
for (const member of team) {
  results.push(await upsertUser(member));
}

console.log('\n=== Resumen — comparte cada contraseña por un canal seguro ===\n');
for (const r of results) {
  if (r.tempPassword) {
    console.log(`${r.name.padEnd(22)} ${r.email.padEnd(32)} rol: ${r.role.padEnd(14)} clave temporal: ${r.tempPassword}`);
  } else {
    console.log(`${r.name.padEnd(22)} ${r.email.padEnd(32)} rol: ${r.role.padEnd(14)} (cuenta ya existía, solo se actualizó el rol)`);
  }
}
console.log('\nListo. Ya pueden iniciar sesión con su correo y esa contraseña.\n');
